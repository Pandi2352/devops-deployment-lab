# Phase 5: AWS Basics + S3 + CloudFront (Free to very low)

**Goal:** a safe AWS account, the basic ideas, and **Deployment 1**: a live HTTPS website that updates from GitHub.

Read [COST-GUIDE.md](COST-GUIDE.md) first.

## Part A: Make the account safe

1. Log in as root. Turn on **MFA** (Security credentials).
2. Billing → check your plan, credits, and credit expiry date. Write them in PROGRESS.md.
3. Billing → Budgets → create a **$5 monthly cost budget** with alerts at 50%, 80%, 100%.
4. Choose one region and use it always. If you signed up with Google, GitHub, Apple or Amazon, AWS already chose it for you.
5. Normal account only: IAM → create user `pandi-admin` with console access, policies `AdministratorAccess` and `SignInLocalDevelopmentAccess`, and MFA. Stop using root. With the new sign-up, skip this and use your own login.

Do **not** enable AWS Organizations, Control Tower, or IAM Identity Center on a Free plan account.

### Install AWS CLI (Ubuntu)

```bash
cd /tmp
curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip -q awscliv2.zip
sudo ./aws/install
aws --version
```

You need 2.32.0 or newer.

```bash
aws configure set region <REGION>
aws login --remote
aws sts get-caller-identity
```

`aws login` gives a temporary session (up to 12 hours). No access key is saved, so nothing can leak.

## Part B: Learn the network (console, free)

Look at the **default VPC** and write one sentence for each:

| Word | Simple meaning |
|---|---|
| VPC | Your private network |
| Subnet | One part of that network, in one zone |
| Internet gateway | Door to the internet |
| Route table | Map of where traffic goes |
| Public subnet | Has a route to the internet gateway |
| Private subnet | Has no such route |
| Security group | Firewall for one resource |
| Elastic IP | Fixed public IP (paid) |
| IAM user / role / policy | Person / temporary identity / permission list |

Practice: create a VPC `lab-vpc` (10.0.0.0/16), 1 public subnet, internet gateway, and route table by hand. Draw it on paper. Delete it. Do **not** create a NAT gateway.

## Part C: Deployment 1, S3 + CloudFront

### Step 1: Bucket

S3 → Create bucket → `devops-lab-<yourname>-<number>`. Keep **Block all public access ON**.

### Step 2: Upload the site

In PowerShell, build: `npm run build` inside `frontend`. In Ubuntu:

```bash
cd /mnt/d/devops/react-devops
aws s3 sync frontend/dist "s3://<BUCKET>" --delete
```

### Step 3: CloudFront

CloudFront → Create distribution:

- Plan: **Free** ($0 per month)
- Origin: your S3 bucket, with private access allowed for CloudFront (Origin Access Control)
- Default root object: `index.html`
- Redirect HTTP to HTTPS
- Error pages: 403 and 404 → `/index.html`, response 200 (needed for React routes)

Open `https://<id>.cloudfront.net`. HTTPS is free. A custom domain is optional and paid.

Opening the S3 object URL directly must give **Access Denied**. That is correct: users go through CloudFront only.

## Part D: Deploy automatically with OIDC (no stored keys)

GitHub proves its identity to AWS, and AWS gives temporary credentials.

### Step 1: Add GitHub as identity provider

IAM → Identity providers → Add → OpenID Connect

- URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

### Step 2: Get your GitHub IDs (PowerShell)

```powershell
gh api repos/<GITHUB_USER>/devops-deployment-lab --jq .owner.id
gh api repos/<GITHUB_USER>/devops-deployment-lab --jq .id
```

Repos created after 15 July 2026 include these numeric IDs in their identity. Many tutorials online are older and will fail with *Not authorized to perform sts:AssumeRoleWithWebIdentity*.

### Step 3: Role trust policy

**File:** `aws/github-trust.json` (replace every `<...>`)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_USER>@<OWNER_ID>/devops-deployment-lab@<REPO_ID>:environment:aws"
        }
      }
    }
  ]
}
```

### Step 4: Role permissions

**File:** `aws/s3-deploy-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<BUCKET>"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::<BUCKET>/*"
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

```bash
aws iam create-role --role-name github-devops-lab --assume-role-policy-document file://aws/github-trust.json
aws iam put-role-policy --role-name github-devops-lab --policy-name s3-deploy --policy-document file://aws/s3-deploy-policy.json
```

### Step 5: GitHub variables

Environment `aws` → Variables: `AWS_REGION`, `AWS_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_ID`. None are secrets.

### Step 6: Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  workflow_dispatch:
    inputs:
      target:
        description: Where to deploy
        type: choice
        options: [s3]
        required: true

permissions:
  contents: read
  id-token: write

jobs:
  s3:
    if: inputs.target == 's3'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment: aws
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - name: Build
        working-directory: frontend
        env:
          VITE_APP_VERSION: ${{ github.sha }}
        run: |
          npm ci
          npm run build
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - name: Upload and refresh cache
        env:
          BUCKET: ${{ vars.S3_BUCKET }}
          DIST: ${{ vars.CLOUDFRONT_ID }}
        run: |
          aws s3 sync frontend/dist "s3://$BUCKET" --delete
          aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*"
```

Run it from the Actions tab, choose `s3`, and approve it. Phase 6 adds `ec2` to the same file.

## Break it

1. Remove `id-token: write`. Read the error.
2. Change the environment name in the trust policy. Read the error.
3. Remove `s3:PutObject`. Read the AccessDenied message: it names the missing permission.

## Cleanup

The S3 site costs almost nothing, so you can keep it. To remove: disable and delete the distribution, then empty and delete the bucket.

## Done when

- [ ] CloudFront URL shows the Git commit version
- [ ] S3 direct URL is denied
- [ ] No AWS access key exists anywhere
- [ ] You can draw a VPC from memory

Next: [Phase 6](06-ec2-docker.md)
