# Phases 7–8: Kubernetes on Your Laptop (Free)

**Goal:** **Deployment 3**: the app in a local Kubernetes cluster with no-downtime updates, self-healing and scaling.

Use **Ubuntu** with Docker Desktop running.

## Phase 7: Fundamentals

| Word | Simple meaning |
|---|---|
| Cluster | Group of machines run by Kubernetes |
| Control plane | The brain |
| Node | A worker machine |
| Pod | One or more containers running together |
| ReplicaSet | Keeps N pods running |
| Deployment | Manages ReplicaSets and updates |
| Service | Stable address for pods |
| ClusterIP / NodePort / LoadBalancer | Inside only / port on nodes / cloud load balancer |
| Ingress | HTTP routing from outside |
| Namespace | Folder inside the cluster |
| ConfigMap / Secret | Settings / sensitive settings (base64, **not encrypted by itself**) |
| PV / PVC | Storage / request for storage |
| Liveness probe | Fails → container is restarted |
| Readiness probe | Fails → pod gets no traffic |
| HPA | Adds or removes pods by load |

### Step 1: Install kubectl and Kind

The kubectl from Docker Desktop (1.32) is too old for the new cluster.

```bash
curl -fsSLo /tmp/kubectl "https://dl.k8s.io/release/$(curl -fsSL https://dl.k8s.io/release/stable-1.37.txt)/bin/linux/amd64/kubectl"
sudo install -m 0755 /tmp/kubectl /usr/local/bin/kubectl
curl -fsSLo /tmp/kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-linux-amd64
sudo install -m 0755 /tmp/kind /usr/local/bin/kind
hash -r
kubectl version --client
kind version
```

We use Kind because it can simulate many nodes. Minikube also works.

### Step 2: Create a cluster

**File:** `k8s/kind-cluster.yaml`

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

```bash
kind create cluster --name lab --config k8s/kind-cluster.yaml
kubectl get nodes
kubectl get pods -A
```

### Step 3: First pod by hand

```bash
kubectl run test --image=nginx:stable-alpine
kubectl get pods -o wide
kubectl describe pod test
kubectl logs test
kubectl delete pod test
```

Delete it and it stays deleted: nothing manages it. That is why we use Deployments.

## Phase 8: Deploy the app

We use **Kustomize**, which is built into kubectl:

- `base/` = files shared by all environments
- `overlays/` = only the differences for dev, staging and production

**File:** `k8s/base/namespace.yaml` (applied separately, so it is not in the kustomization)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: lab
---
apiVersion: v1
kind: Namespace
metadata:
  name: lab-staging
---
apiVersion: v1
kind: Namespace
metadata:
  name: lab-production
```

**File:** `k8s/base/configmap.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  config.json: |
    { "environment": "local" }
```

**File:** `k8s/base/deployment.yaml` (`image: frontend` is a placeholder; the overlay fills in the real image)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: frontend
          ports:
            - name: http
              containerPort: 8080
          readinessProbe:
            httpGet:
              path: /healthz
              port: http
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            periodSeconds: 10
          resources:
            requests:
              cpu: 25m
              memory: 32Mi
            limits:
              memory: 128Mi
          volumeMounts:
            - name: config
              mountPath: /usr/share/nginx/html/config.json
              subPath: config.json
      volumes:
        - name: config
          configMap:
            name: frontend-config
```

**File:** `k8s/base/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - name: http
      port: 80
      targetPort: http
```

**File:** `k8s/base/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - configmap.yaml
  - deployment.yaml
  - service.yaml
```

**File:** `k8s/overlays/dev/kustomization.yaml` (replace `<GITHUB_USER>` and `<SHA>`)

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: lab
resources:
  - ../../base
images:
  - name: frontend
    newName: ghcr.io/<GITHUB_USER>/devops-deployment-lab
    newTag: "<SHA>"
```

### Step 4: Apply and open

Look at the final YAML first, then apply it:

```bash
kubectl config current-context
kubectl apply -f k8s/base/namespace.yaml
kubectl kustomize k8s/overlays/dev
kubectl apply -k k8s/overlays/dev
kubectl get all -n lab
kubectl rollout status deployment/frontend -n lab
kubectl port-forward -n lab svc/frontend 8080:80
```

Open http://localhost:8080 and http://localhost:8080/config.json. Stop with Ctrl+C.

### Step 5: Ingress with Traefik

Install Helm, then Traefik:

```bash
curl -fsSLo /tmp/helm.tgz https://get.helm.sh/helm-v4.3.2-linux-amd64.tar.gz
tar -xzf /tmp/helm.tgz -C /tmp
sudo install -m 0755 /tmp/linux-amd64/helm /usr/local/bin/helm

helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik traefik/traefik -n traefik --create-namespace
kubectl get ingressclass
```

**File:** `k8s/base/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend
spec:
  ingressClassName: traefik
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  name: http
```

Add `- ingress.yaml` to `resources` in `k8s/base/kustomization.yaml`, then:

```bash
kubectl apply -k k8s/overlays/dev
kubectl port-forward -n traefik svc/traefik 8080:80
```

Traefik's service shows `EXTERNAL-IP <pending>`. That is normal on Kind: there is no cloud load balancer. For new projects also read about **Gateway API**, the successor of Ingress.

### Step 6: Rolling update and rollback

```bash
kubectl set image -n lab deployment/frontend frontend=ghcr.io/<GITHUB_USER>/devops-deployment-lab:<OTHER_SHA>
kubectl rollout status -n lab deployment/frontend
kubectl rollout history -n lab deployment/frontend
kubectl rollout undo -n lab deployment/frontend
```

### Step 7: Self-healing

```bash
kubectl get pods -n lab -w
```

In another terminal: `kubectl delete pod -n lab -l app=frontend`. New pods appear by themselves.

### Step 8: Scaling

```bash
kubectl scale -n lab deployment/frontend --replicas=5
kubectl get pods -n lab -o wide

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch -n kube-system deployment metrics-server --type=json -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl top pods -n lab
```

The insecure flag is for Kind only.

**File:** `k8s/base/hpa.yaml`

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

1. Add `- hpa.yaml` to `resources` in `k8s/base/kustomization.yaml`.
2. **Delete** the `replicas: 2` line from `deployment.yaml`. From now on the HPA decides the number.

```bash
kubectl apply -k k8s/overlays/dev
kubectl get hpa -n lab
```

### Step 8b: Staging overlay

**File:** `k8s/overlays/staging/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: lab-staging
resources:
  - ../../base
images:
  - name: frontend
    newName: ghcr.io/<GITHUB_USER>/devops-deployment-lab
    newTag: "<SHA>"
patches:
  - target:
      kind: Ingress
      name: frontend
    patch: |-
      - op: add
        path: /spec/rules/0/host
        value: staging.localhost
  - target:
      kind: ConfigMap
      name: frontend-config
    patch: |-
      - op: replace
        path: /data/config.json
        value: '{ "environment": "staging" }'
```

```bash
kubectl apply -k k8s/overlays/staging
kubectl diff -k k8s/overlays/staging
```

With the Traefik port-forward running, open http://staging.localhost:8080/config.json. The `production` overlay is for EKS and comes in phase 9.

### Step 8c: Deploy script

**File:** `scripts/deploy.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
env="${1:?Usage: ./scripts/deploy.sh <dev|staging>}"
case "$env" in
  dev) ns=lab ;;
  staging) ns=lab-staging ;;
  *) echo "Unknown environment: $env"; exit 1 ;;
esac

context=$(kubectl config current-context)
[[ "$context" == "kind-lab" ]] || { echo "Wrong cluster: $context"; exit 1; }

kubectl apply -f k8s/base/namespace.yaml
kubectl apply -k "k8s/overlays/$env"
kubectl rollout status -n "$ns" deployment/frontend --timeout=120s
```

### Step 9: Secret (practice only)

```bash
kubectl create secret generic demo -n lab --from-literal=password=not-real
kubectl get secret demo -n lab -o jsonpath='{.data.password}' | base64 -d
kubectl delete secret demo -n lab
```

Anyone with access can read it. A frontend must never receive a secret.

### Step 10: Storage (practice only)

Create a PVC of 1Gi, mount it in a test pod at `/data`, write a file, delete the pod, create it again, and confirm the file is still there.

## Break it

| Do this | You see | Find it with |
|---|---|---|
| Wrong image tag | ImagePullBackOff | `kubectl describe pod` |
| `command: ["false"]` | CrashLoopBackOff | `kubectl logs --previous` |
| Wrong probe path | Pod never Ready | `kubectl describe pod` |
| Wrong Service selector | No endpoints | `kubectl get endpointslices -n lab` |
| Request 100 CPU | Pending | `kubectl get events -n lab` |

## Cleanup

```bash
kind delete cluster --name lab
```

## Done when

- [ ] App reachable through Ingress
- [ ] Update and rollback work
- [ ] You fixed all 5 failures using only kubectl
- [ ] You can explain Pod, Deployment, Service, Ingress

Next: [Phase 9](09-ecr-eks.md)
