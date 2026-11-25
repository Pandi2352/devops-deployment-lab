# Cost Guide: What Is Free and What Is Not

Checked on 25 November 2026. AWS prices are US examples in USD and change by region. Check the official page before you create anything.

## 1. Tools

| Tool | Free? |
|---|---|
| VS Code, Git, Node.js, WSL2, Ubuntu | Free |
| Docker Desktop | Free for personal use and small companies. A larger company needs a paid license |
| Kind, Minikube, kubectl, Helm, Argo CD, eksctl | Free |
| Terraform | Free to use |
| Prometheus, Grafana, Loki, Alloy (self-hosted) | Free |
| Trivy, Gitleaks, OWASP ZAP, Dependabot | Free |
| SonarQube Cloud | Free for public projects |
| GitHub Actions, **public repo** | Free on standard runners |
| GitHub Actions, **private repo** | $12 of usage per month included, then paid |
| GHCR (GitHub container registry) | Free for public images |
| Docker Hub | Free plan, with limits |

**Keep this repo public.** Actions, GHCR images, and required reviewers on environments are then free.

## 2. Your AWS account

New customers get **$100** in credits, plus up to **$100 more** ($20 per activity: launch EC2, create a budget, create a Lambda app, create an RDS database, create a DynamoDB table, use Bedrock). Two of these, the budget and EC2, are already in this plan.

Two plans exist. Find yours in the AWS console home page or Billing.

| | Free plan | Paid plan |
|---|---|---|
| Can you be charged? | No, the credits pay | Yes, after credits finish |
| Ends | After 6 months **or** when credits finish, whichever is first | Does not end |
| When it ends | Account is suspended; data is deleted after 90 days unless you upgrade | Nothing, you pay |
| Services | Some are blocked | All |

Important:

- AWS pages disagree on whether credits expire after 6 or 12 months. Trust the date in **your** Billing console.
- Joining **AWS Organizations** or **Control Tower** upgrades a Free plan account to Paid. Do not do it.
- The credits and Free plan are for new customers only. If you had an AWS account before, treat everything as paid.
- Accounts made with the new sign-up (Google, GitHub, Apple or Amazon login) are limited to **one region**, chosen by country. Use that region everywhere in these guides.

## 3. AWS services

| Service | Price | Verdict |
|---|---|---|
| IAM, VPC, subnets, route tables, security groups | $0 | Free |
| AWS Budgets alerts | $0 | Free |
| ACM public certificate (for ALB or CloudFront) | $0 | Free |
| CloudFront Free plan | $0: 1M requests, 100 GB per month, no overage charges | Free |
| S3 | Cents for this small site | Very low |
| CloudWatch | 5 GB logs, 10 alarms, 3 dashboards per month free | Free at our size |
| Lambda, SQS, SNS | Free monthly allowance | Free at our size |
| EC2 `t3.small` | about $0.021/hour | Uses credits |
| EC2 `t3.medium` | about $0.042/hour | Uses credits |
| Public IPv4 address | $0.005/hour (about $3.65/month) | Uses credits |
| EBS disk | Paid per GB-month, **even when EC2 is stopped** | Uses credits |
| ECR private | $0.10 per GB-month | Very low |
| Route 53 hosted zone | $0.50/month, plus domain price | Paid, optional |
| Secrets Manager | $0.40 per secret per month | Paid, low |
| Application Load Balancer | $0.0225/hour + usage (about $16+/month) | **Delete same day** |
| NAT gateway | about $0.045/hour + data (about $33/month) | **Avoid**; not used in this plan |
| EKS cluster | $0.10/hour (about $73/month) | **Delete same day** |
| EKS on an old Kubernetes version | $0.60/hour | **Avoid** |

### One EKS practice session

Cluster + 2 worker nodes + 1 load balancer + public IPs is roughly **$0.30–0.40 per hour**, so 3 hours is about **$1**.
Forgotten for a month it is roughly **$250**. That is all your credits.

## 4. Safety setup (do this first, in phase 5)

1. Turn on MFA for the root user.
2. Create a **$5 monthly budget** with email alerts at 50%, 80% and 100%.
3. Put a tag `project=devops-lab` on every resource.
4. Use short-lived login (`aws login`) and OIDC. Create no access keys.
5. Set a phone alarm whenever you start a paid session.

A budget alert only sends an email. It does **not** stop resources.

## 5. Cleanup checklist (end of every AWS session)

Check these in **your region**:

- [ ] EKS clusters
- [ ] EC2 instances (terminate, not just stop)
- [ ] EC2 → Load balancers
- [ ] EC2 → Target groups
- [ ] EC2 → Volumes
- [ ] EC2 → Elastic IPs
- [ ] VPC → NAT gateways
- [ ] VPC → VPCs created for the lab
- [ ] CloudFormation → stacks (eksctl creates these)
- [ ] CloudWatch → old log groups
- [ ] ECR → old images
- [ ] Next day: Billing → Cost Explorer, confirm cost is going down to zero

## Official pages

- [AWS Free Tier FAQ](https://aws.amazon.com/free/faqs/)
- [Earn extra credits](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans-activities.html)
- [New sign-up and regions](https://docs.aws.amazon.com/accounts/latest/reference/sign-in-new.html)
- [EKS pricing](https://aws.amazon.com/eks/pricing/)
- [VPC and public IPv4 pricing](https://aws.amazon.com/vpc/pricing/)
- [Load balancer pricing](https://aws.amazon.com/elasticloadbalancing/pricing/)
- [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/)
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- [GitHub Packages billing](https://docs.github.com/en/billing/concepts/product-billing/github-packages)
