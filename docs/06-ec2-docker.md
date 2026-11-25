# Phase 6: EC2 + Docker (Low cost, uses credits)

**Goal:** **Deployment 2**: your container on a real Linux server, with HTTPS and automatic deploy.

Cost: instance + disk + public IP. **Terminate it when finished.**

## Step 1: Role for the server

IAM → Roles → Create → AWS service → EC2 → policy `AmazonSSMManagedInstanceCore` → name `ec2-devops-lab`.

This lets AWS Systems Manager (SSM) run commands on the server, so GitHub never needs SSH.

## Step 2: Launch EC2

| Setting | Value |
|---|---|
| Name | `devops-lab` |
| OS | Ubuntu Server LTS (x86) |
| Type | `t3.micro`, must say *Free tier eligible* |
| Key pair | Import your `~/.ssh/id_ed25519.pub` from phase 2 |
| Security group | SSH 22: **My IP only**. HTTP 80 and HTTPS 443: anywhere |
| Disk | 8–10 GB gp3 |
| IAM instance profile | `ec2-devops-lab` |
| Tag | `project=devops-lab` |

## Step 3: Connect

```bash
ssh ubuntu@<PUBLIC_IP>
```

## Step 4: Install Docker and Nginx (on the server)

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y docker.io nginx
sudo systemctl enable --now docker nginx
```

## Step 5: Run the container

```bash
sudo docker run -d --name lab --restart unless-stopped -p 127.0.0.1:8080:8080 ghcr.io/<GITHUB_USER>/devops-deployment-lab:latest
curl http://127.0.0.1:8080/healthz
```

`127.0.0.1` means only the server itself can reach the container. Users go through Nginx.

## Step 6: Nginx reverse proxy

**File on the server:** `/etc/nginx/sites-available/lab`

```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/lab /etc/nginx/sites-enabled/lab
sudo nginx -t
sudo systemctl reload nginx
```

Open `http://<PUBLIC_IP>`.

## Step 7: HTTPS (free)

A certificate needs a name. DuckDNS gives a free one.

1. duckdns.org → create a name → set it to your EC2 public IP.
2. In the Nginx file, change `server_name _;` to `server_name <name>.duckdns.org;`, then reload Nginx.
3. On the server:

```bash
sudo snap install --classic certbot
sudo certbot --nginx -d <name>.duckdns.org
sudo certbot renew --dry-run
```

Open `https://<name>.duckdns.org`. The public IP changes if you stop and start the server; update DuckDNS then.

## Step 8: Automatic deploy through SSM

Add permission to your GitHub role.

**File:** `aws/ssm-deploy-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ssm:SendCommand",
      "Resource": [
        "arn:aws:ec2:<REGION>:<ACCOUNT_ID>:instance/<INSTANCE_ID>",
        "arn:aws:ssm:<REGION>::document/AWS-RunShellScript"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "ssm:GetCommandInvocation",
      "Resource": "*"
    }
  ]
}
```

```bash
aws iam put-role-policy --role-name github-devops-lab --policy-name ssm-deploy --policy-document file://aws/ssm-deploy-policy.json
```

Add variable `EC2_INSTANCE_ID` to the `aws` environment.

In `.github/workflows/deploy.yml`, change `inputs` to:

```yaml
    inputs:
      target:
        description: Where to deploy
        type: choice
        options: [s3, ec2]
        required: true
      tag:
        description: Full commit SHA (EC2 only)
        required: false
```

Then add this job under `jobs:`

```yaml
  ec2:
    if: inputs.target == 'ec2'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment: aws
    steps:
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      - name: Deploy
        env:
          TAG: ${{ inputs.tag }}
          INSTANCE: ${{ vars.EC2_INSTANCE_ID }}
          REPO: ${{ github.repository }}
        run: |
          set -euo pipefail
          [[ "$TAG" =~ ^[0-9a-f]{40}$ ]] || { echo "Tag must be a full commit SHA"; exit 1; }
          IMAGE="ghcr.io/${REPO,,}:$TAG"
          PARAMS=$(jq -n --arg i "$IMAGE" '{commands: [
            "set -e",
            "docker pull \($i)",
            "docker rm -f lab || true",
            "docker run -d --name lab --restart unless-stopped -p 127.0.0.1:8080:8080 \($i)",
            "sleep 5",
            "curl -fsS http://127.0.0.1:8080/healthz"
          ]}')
          ID=$(aws ssm send-command --instance-ids "$INSTANCE" --document-name AWS-RunShellScript --parameters "$PARAMS" --query Command.CommandId --output text)
          aws ssm wait command-executed --command-id "$ID" --instance-id "$INSTANCE" || true
          aws ssm get-command-invocation --command-id "$ID" --instance-id "$INSTANCE" --query '[Status,StandardOutputContent,StandardErrorContent]' --output text
          test "$(aws ssm get-command-invocation --command-id "$ID" --instance-id "$INSTANCE" --query Status --output text)" = Success
```

Run it with the newest SHA, then with an **older SHA**. That is your rollback.

This stops the old container before starting the new one, so there are a few seconds of downtime. Kubernetes solves this in the next phase.

## Break it

1. Remove port 80 from the security group. The browser times out.
2. `sudo docker stop lab`. Nginx shows **502 Bad Gateway**.
3. Deploy a SHA that does not exist.

Learn the difference: **timeout = firewall or network; 502 = the app behind the proxy is down; 404 = wrong path.**

## Cleanup

- [ ] Terminate the instance
- [ ] Check Volumes and Elastic IPs are empty
- [ ] Remove the `ssm-deploy` policy from the role

## Done when

- [ ] HTTPS site works
- [ ] Deploy and rollback work from GitHub
- [ ] Port 22 was never open to everyone

Next: [Phases 7–8](07-08-kubernetes-local.md)
