# Architecture Overview

## The 5 deployments

| # | Phase | Path from code to user |
|---|---|---|
| 1 | 5 | GitHub Actions → S3 → CloudFront → user |
| 2 | 6 | GitHub Actions → GHCR → EC2: Nginx → container → user |
| 3 | 7–8 | GHCR → Kind: Traefik → Service → Pods → your browser |
| 4 | 9 | ECR → EKS: load balancer → Pods → user |
| 5 | 18 | GitHub Actions → GitOps repo → Argo CD → EKS → user |

## CI/CD flow

```text
Branch --> Pull request --> ci.yml: lint, test, build
                        --> security-scan.yml: secrets, config
                              |
                         merge to main
                              |
                              v
                 docker-build.yml: build, Trivy scan, push
                              |
             +----------------+----------------+
             v                                 v
   deploy.yml (manual)               update GitOps repo
     S3 or EC2                                 |
                                               v
                                            Argo CD
                                               |
                                               v
                                           Kubernetes
```

## A request inside Kubernetes

```text
Browser --> Load balancer / Traefik --> Ingress rule --> Service --> Pod (Nginx:8080) --> React files
```

## Environments

| Environment | Where | Namespace | Address | Cost |
|---|---|---|---|---|
| dev | Kind | `lab` | http://localhost:8080 | Free |
| staging | Kind | `lab-staging` | http://staging.localhost:8080 | Free |
| production | EKS, short sessions | `lab-production` | Load balancer address | Paid |

## Who is allowed to do what

| Who | Access | How |
|---|---|---|
| You | AWS admin | `aws login`, temporary, MFA |
| GitHub Actions | Only deploy to S3 and EC2 | OIDC role, temporary |
| GitHub Actions | Write to GitOps repo only | Deploy key |
| EC2 | Receive SSM commands | Instance role |
| Load Balancer Controller | Create load balancers | EKS Pod Identity |
| Argo CD | Change the cluster | Runs inside the cluster |

No long-lived AWS access key exists anywhere.

## Main decisions

| Decision | Why |
|---|---|
| Deploy commit SHA tags, not `latest` | You know what is running and can roll back |
| Container runs as non-root on port 8080 | Safer; required by strict pod security |
| Nginx serves built files, not `npm run dev` | Small, fast, production-ready |
| OIDC, not access keys | Nothing to leak |
| GitOps (pull), not CI push | CI needs no cluster access; Git is the history |
| No NAT gateway | Saves about $33 per month in a lab. Real production uses private subnets |
| EKS only in short sessions | Saves about $250 per month |

When you make a new decision, add a row here. This is good interview material.
