# Phases 17–18: Break/Fix and Final Project

## Phase 17: Production simulation (free on Kind, except where marked)

For each problem: break it, pretend you do not know the cause, find it, fix it, and write 4 lines: **symptom, how I found it, cause, how to prevent it**.

Debug order: **What changed? → Argo CD → pods → describe/events → logs → service/endpoints → ingress → network.**

| # | Break | Symptom |
|---|---|---|
| 1 | Wrong image tag | ImagePullBackOff |
| 2 | Container exits | CrashLoopBackOff |
| 3 | Memory limit 4Mi | OOMKilled or fails to start |
| 4 | Request 100 CPU | Pending |
| 5 | Wrong readiness path | Not Ready, no traffic |
| 6 | Wrong Service selector | 502/503, no endpoints |
| 7 | Wrong Ingress class | 404 or no route |
| 8 | Lint or test fails | CI blocked |
| 9 | Vulnerable base image | Trivy blocks |
| 10 | Wrong OIDC `sub` (AWS, free) | AssumeRole denied |
| 11 | IAM permission removed (AWS, free) | AccessDenied |
| 12 | Security group port closed (EC2, low cost) | Timeout |
| 13 | Nginx config typo | Container will not start |
| 14 | Bad GitOps commit | Argo CD sync failed |
| 15 | Load test with low CPU limit | Slow responses, HPA scales |

## Phase 18: Final project (one paid EKS session, about $1–2)

### Before the session

- [ ] Everything works on Kind
- [ ] Terraform plan is clean
- [ ] Chart has `values-prod.yaml` (ECR image, `alb` ingress class and annotations)
- [ ] Budget alert active, credits checked
- [ ] Cleanup commands open in another window

### During the session (about 4 hours)

1. In `terraform/environments/dev`: `terraform apply -var region=<REGION> -var create_eks=true`
2. Connect kubectl.
3. Push the image to ECR (Terraform created the repository). Optional: let CI push to ECR through OIDC.
4. Install AWS Load Balancer Controller (phase 9, step 6).
5. Install Argo CD and apply the Application using `values-prod.yaml`. This is **Deployment 5**.
6. Install kube-prometheus-stack.
7. Open the app through the ALB. With your own domain, add an ACM certificate and HTTPS.
8. Change the app, merge, and watch it go live with no manual step.
9. Roll back with `git revert`.
10. Delete a pod and drain a node while the site stays up.
11. Take screenshots: Actions, Argo CD, Grafana, live site, `kubectl get all`.

### Cleanup, same day

1. Delete the Argo CD Application **including its resources**. Use the UI delete with Foreground, because a plain delete can leave the Ingress and load balancer behind.
2. Confirm the load balancer is gone.
3. Delete the Pod Identity association role, and the IAM policy.
4. `terraform destroy -var region=<REGION> -var create_eks=true`
5. Full checklist in [COST-GUIDE.md](COST-GUIDE.md).
6. Check Billing the next day.

### Portfolio

Root `README.md` should have:

- What it is, in 3 lines
- Architecture diagram
- Screenshots
- Live URL (S3 + CloudFront can stay live at almost no cost)
- How to run locally
- Decisions: why OIDC, why GitOps, why SHA tags, why no NAT
- Problems you solved (from phase 17)
- Cost summary

## Interview questions you should be able to answer

1. What happens from `git push` until users see the change?
2. Image vs container? Why multi-stage?
3. Deployment vs ReplicaSet vs Pod?
4. Liveness vs readiness?
5. How do you roll back?
6. Why OIDC, not access keys?
7. What is Terraform state, and why remote?
8. Push deployment vs GitOps pull?
9. The site is down. What do you check first?
10. How do you stop AWS cost surprises?

## Done when

- [ ] 10 or more break/fix notes written
- [ ] Full pipeline worked on EKS once
- [ ] All paid resources deleted
- [ ] Portfolio README published
- [ ] You can answer the 10 questions without notes
