# DevOps Lab: Step-by-Step Plan

One small React + TypeScript + Tailwind app, deployed 5 different ways, to learn DevOps from start to production.

The app stays simple. The learning is in everything that happens **after** you write code.

## How to use these docs

1. Open the guide for your current phase (table below).
2. Do the steps in order. Type the commands yourself.
3. Pass the **Done when** check at the end of the guide.
4. Break it and fix it (each guide has a **Break it** section).
5. Tick it in [PROGRESS.md](PROGRESS.md), then go to the next phase.

Before you create anything in AWS, read [COST-GUIDE.md](COST-GUIDE.md).

## The plan

| Phase | Guide | You will have | Cost | Approx. time |
|---|---|---|---|---|
| 0 | [Setup Windows + Ubuntu](00-setup.md) | Laptop ready | Free | 1 day |
| 1 | [App and Git](01-app-and-git.md) | React app on GitHub with pull requests | Free | 2 days |
| 2 | [Linux](02-linux.md) | Comfortable in a Linux terminal | Free | 1 week |
| 3 | [Docker](03-docker.md) | App running in a production container | Free | 1 week |
| 4 | [GitHub Actions](04-github-actions.md) | Every push tested, built and published | Free (public repo) | 1 week |
| 5 | [AWS basics, S3 + CloudFront](05-aws-fundamentals.md) | **Deployment 1:** live HTTPS website | Free to very low | 1 week |
| 6 | [EC2 + Docker](06-ec2-docker.md) | **Deployment 2:** container on a server | Low, uses credits | 1 week |
| 7–8 | [Kubernetes on your laptop](07-08-kubernetes-local.md) | **Deployment 3:** local Kubernetes | Free | 2 weeks |
| 9 | [ECR + EKS](09-ecr-eks.md) | **Deployment 4:** AWS Kubernetes | **Paid**, about $1–2 per session | 1 week |
| 10 | [Terraform](10-terraform.md) | AWS created from code | Tool free, resources paid | 1 week |
| 11 | [Argo CD](11-argocd-gitops.md) | GitOps (learn locally, then **Deployment 5** on EKS) | Free locally | 1 week |
| 12 | [Helm](12-helm.md) | One chart for dev and prod | Free | 4 days |
| 13 | [Security](13-devsecops.md) | Security checks in the pipeline | Free | 1 week |
| 14 | [Monitoring](14-monitoring.md) | Dashboards, logs, alerts | Free locally | 1 week |
| 15–16 | [Advanced + extra tools](15-16-advanced.md) | Canary, scaling, other tools | Mostly free | 2 weeks |
| 17–18 | [Break/fix + final project](17-18-final-project.md) | Portfolio project | Low, one EKS session | 2 weeks |

Total: about 4 months at 1–2 hours per day. Times are a guess; go at your own speed.

## Final architecture

```text
You (Windows + Ubuntu WSL)
   | git push
   v
GitHub repo --> GitHub Actions: lint, test, build, scan
                     |
                     v
               Docker image --> GHCR (phase 4) / Amazon ECR (phase 9)
                     |
                     v
        GitOps repo (image tag updated)
                     |
                     v
                  Argo CD --> Kubernetes (Kind, then EKS)
                                  |
                                  v
                     Load balancer + HTTPS --> users

Prometheus (metrics) + Loki (logs) --> Grafana (dashboards, alerts)
```

More detail: [architecture.md](architecture.md)

## Repository structure

See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for every folder and the phase that creates it. The folders are ready; fill them phase by phase.

Phase 11 adds a second repository: `devops-deployment-lab-gitops`.

Stuck on an error? See [common-errors.md](common-errors.md).

## Rules for every phase

- Never commit passwords, keys, `.env` files, or `*.tfstate`.
- Never put a secret in the React app. Everything in a frontend build is public.
- Every paid AWS session ends with the cleanup steps, the **same day**.
- Work on a branch and open a pull request, even alone.
- After each phase write 5 lines in your own words: what it is, why it is used, what broke.

## Changes made to your original plan, and why

| Original plan | Now | Reason |
|---|---|---|
| Node.js 20 (installed on your laptop) | Node.js LTS (24 or 26) | Node 20 support ended 30 April 2026 |
| Nginx Ingress controller, if chosen | Traefik locally, AWS Load Balancer Controller on EKS | `ingress-nginx` was retired in March 2026 |
| Promtail | Grafana Alloy | Promtail support ended 2 March 2026 |
| AWS OIDC in phase 13 | Moved to phase 5 | First AWS deploy should not use stored access keys |
| GitHub Actions SSH to EC2 | AWS Systems Manager (SSM) | No need to open SSH port 22 to the internet |
| Trivy | Trivy pinned to a commit SHA | Its GitHub Action was hacked in March 2026 |
| IAM Identity Center / Organizations | Not used | Joining an Organization upgrades a Free plan account to Paid |

Versions and prices were looked up on 25 November 2026. The app template was generated once to confirm its files, but the commands and config files in these guides have **not** been run end to end. If a step fails, the error is part of the practice; share it and we fix it together.
