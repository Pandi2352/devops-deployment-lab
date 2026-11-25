# Phase 9: Amazon ECR + EKS (PAID, delete the same day)

**Goal:** **Deployment 4**: the same app on AWS-managed Kubernetes, with a public load balancer.

About **$0.30–0.40 per hour**. Plan one 3-hour session. Set an alarm. Read all steps before starting.

## Before the session (no cost)

### Step 1: Install eksctl

```bash
curl -fsSLo /tmp/eksctl.tgz https://github.com/eksctl-io/eksctl/releases/download/v0.232.0/eksctl_Linux_amd64.tar.gz
tar -xzf /tmp/eksctl.tgz -C /tmp
sudo install -m 0755 /tmp/eksctl /usr/local/bin/eksctl
eksctl version
```

### Step 2: Check what your account allows

```bash
aws login --remote
export AWS_REGION=<REGION>
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ec2 describe-instance-types --filters Name=free-tier-eligible,Values=true --query 'InstanceTypes[].InstanceType' --output text
```

Choose a type with 4 GB memory, such as `c7i-flex.large`. `t3.small` (2 GB) runs few pods. A Free plan account may refuse other types.

### Step 3: Cluster file

**File:** `aws/eks-cluster.yaml`

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: devops-lab
  region: <REGION>
  version: "1.36"
  tags:
    project: devops-lab
vpc:
  nat:
    gateway: Disable
addons:
  - name: vpc-cni
  - name: coredns
  - name: kube-proxy
  - name: eks-pod-identity-agent
managedNodeGroups:
  - name: workers
    instanceType: c7i-flex.large
    desiredCapacity: 2
    minSize: 1
    maxSize: 3
    volumeSize: 20
```

NAT is off to save money, so nodes use public subnets. Real production uses private subnets. Check that version 1.36 is still in [standard support](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html).

## The session

### Step 4: ECR and push the image

```bash
aws ecr create-repository --repository-name devops-lab --image-scanning-configuration scanOnPush=true --tags Key=project,Value=devops-lab
export ECR=$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR
docker pull ghcr.io/<GITHUB_USER>/devops-deployment-lab:<SHA>
docker tag ghcr.io/<GITHUB_USER>/devops-deployment-lab:<SHA> $ECR/devops-lab:<SHA>
docker push $ECR/devops-lab:<SHA>
```

### Step 5: Create the cluster (15–20 minutes, cost starts now)

```bash
eksctl create cluster -f aws/eks-cluster.yaml
kubectl config get-contexts
kubectl get nodes
```

### Step 6: AWS Load Balancer Controller

```bash
curl -fsSLo /tmp/iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v3.6.3/docs/install/iam_policy.json
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file:///tmp/iam_policy.json

eksctl create podidentityassociation --cluster devops-lab --region $AWS_REGION \
  --namespace kube-system --service-account-name aws-load-balancer-controller \
  --permission-policy-arns arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --role-name AmazonEKSLoadBalancerControllerRole --create-service-account

helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system \
  --set clusterName=devops-lab \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --version 3.6.3
kubectl rollout status -n kube-system deployment/aws-load-balancer-controller
```

### Step 7: Deploy the app

The production overlay changes the image to ECR and the Ingress to an AWS load balancer.

**File:** `k8s/overlays/production/kustomization.yaml` (write this before the session)

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: lab-production
resources:
  - ../../base
images:
  - name: frontend
    newName: <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/devops-lab
    newTag: "<SHA>"
patches:
  - target:
      kind: Ingress
      name: frontend
    patch: |-
      - op: replace
        path: /spec/ingressClassName
        value: alb
      - op: add
        path: /metadata/annotations
        value:
          alb.ingress.kubernetes.io/scheme: internet-facing
          alb.ingress.kubernetes.io/target-type: ip
          alb.ingress.kubernetes.io/healthcheck-path: /healthz
  - target:
      kind: ConfigMap
      name: frontend-config
    patch: |-
      - op: replace
        path: /data/config.json
        value: '{ "environment": "production" }'
```

```bash
kubectl config current-context
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -k k8s/overlays/production
kubectl get ingress -n lab-production -w
```

If `kubectl top nodes` does not work, install metrics-server as in phase 8, but **without** the insecure patch.

Wait 2–3 minutes and open `http://<ADDRESS>`. HTTPS on an ALB needs your own domain plus an ACM certificate (certificate free, domain paid).

### Step 8: Practice

Repeat rolling update, rollback, pod delete, and HPA from phase 8. Also drain a node:

```bash
kubectl drain <NODE> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <NODE>
```

## CLEANUP: do it now, in this order

```bash
kubectl delete ingress -n lab-production frontend
aws elbv2 describe-load-balancers --query 'LoadBalancers[].LoadBalancerName'
```

Wait until the load balancer is gone. If you delete the cluster first, the load balancer stays and keeps charging.

```bash
eksctl delete cluster --name devops-lab --region $AWS_REGION --wait
aws ecr delete-repository --repository-name devops-lab --force
aws iam delete-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy
```

`--force` deletes all images in that ECR repository. They can be pushed again from GHCR.

**File:** `scripts/cleanup.sh`. It only **lists** what is left; you delete after looking.

```bash
#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?Set AWS_REGION first}"
export AWS_REGION AWS_PAGER=""
aws sts get-caller-identity --query Account --output text

echo "EKS clusters:";   aws eks list-clusters --query 'clusters' --output text
echo "EC2 instances:";  aws ec2 describe-instances --filters Name=instance-state-name,Values=pending,running,stopping,stopped --query 'Reservations[].Instances[].InstanceId' --output text
echo "Load balancers:"; aws elbv2 describe-load-balancers --query 'LoadBalancers[].LoadBalancerName' --output text
echo "Volumes:";        aws ec2 describe-volumes --query 'Volumes[].VolumeId' --output text
echo "Elastic IPs:";    aws ec2 describe-addresses --query 'Addresses[].PublicIp' --output text
echo "NAT gateways:";   aws ec2 describe-nat-gateways --filter Name=state,Values=pending,available --query 'NatGateways[].NatGatewayId' --output text
echo "ECR repos:";      aws ecr describe-repositories --query 'repositories[].repositoryName' --output text
```

Run `./scripts/cleanup.sh`, then complete the checklist in [COST-GUIDE.md](COST-GUIDE.md).

## Break it (during the session)

1. Wrong ECR tag → ImagePullBackOff.
2. Remove the pod identity association, restart the controller, and create a new Ingress → AccessDenied in the controller logs.

## Done when

- [ ] App opened through the ALB address
- [ ] You can explain ECR, node group, ALB, Pod Identity
- [ ] Nothing is left; cost checked the next day

Next: [Phase 10](10-terraform.md)
