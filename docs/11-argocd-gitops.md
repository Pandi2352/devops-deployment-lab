# Phase 11: Argo CD and GitOps (Free locally)

**Goal:** Git decides what runs in the cluster. CI never touches the cluster; Argo CD **pulls** from Git.

```text
App repo --> CI builds image --> CI changes the tag in GitOps repo --> Argo CD syncs --> Kubernetes
```

Do this on Kind first. Repeat on EKS only in phase 18.

## Step 1: GitOps repo

Create a public repo `devops-deployment-lab-gitops` and copy `k8s/base` and `k8s/overlays` into it. From now on, the GitOps repo is the truth for the cluster.

## Step 2: Install Argo CD

```bash
kind create cluster --name lab --config k8s/kind-cluster.yaml
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.6.3/manifests/install.yaml
kubectl rollout status -n argocd deployment/argocd-server
kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo
kubectl port-forward -n argocd svc/argocd-server 8443:443
```

Open https://localhost:8443 (accept the warning, it is local). User `admin`.

Also reinstall Traefik and metrics-server (phase 8, steps 5 and 8), because this is a new cluster.

## Step 3: Project and Application

A project limits what an application may deploy, and where.

**File:** `argocd/projects/lab.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: lab
  namespace: argocd
spec:
  sourceRepos:
    - https://github.com/<GITHUB_USER>/devops-deployment-lab-gitops.git
  destinations:
    - server: https://kubernetes.default.svc
      namespace: lab
    - server: https://kubernetes.default.svc
      namespace: lab-*
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
```

**File:** `argocd/applications/frontend.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: frontend
  namespace: argocd
spec:
  project: lab
  source:
    repoURL: https://github.com/<GITHUB_USER>/devops-deployment-lab-gitops.git
    targetRevision: main
    path: overlays/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: lab
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

```bash
kubectl apply -f argocd/projects/lab.yaml
kubectl apply -f argocd/applications/frontend.yaml
kubectl get applications -n argocd
```

## Step 4: See GitOps working

1. Change `minReplicas` in `base/hpa.yaml` of the GitOps repo to 3, push, and wait a few minutes (or press Refresh). Pods change.
2. `kubectl delete service -n lab frontend`. Argo CD creates it again. This is **self-heal**.
3. `git revert` the first commit and push. This is **rollback**.

## Step 5: CI updates the image tag

Create a key that can write only to the GitOps repo. In Ubuntu:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/gitops_deploy -N "" -C gitops
```

- GitOps repo → Settings → Deploy keys → add `gitops_deploy.pub`, **allow write**.
- App repo → Settings → Environments → new environment `gitops`, `main` branch only → secret `GITOPS_SSH_KEY` = content of `gitops_deploy`.

Add this job to `.github/workflows/ci.yml`:

```yaml
  update-gitops:
    needs: image
    runs-on: ubuntu-latest
    timeout-minutes: 5
    environment: gitops
    steps:
      - uses: actions/checkout@v7
        with:
          repository: ${{ github.repository_owner }}/devops-deployment-lab-gitops
          ssh-key: ${{ secrets.GITOPS_SSH_KEY }}
      - name: Change image tag
        env:
          TAG: ${{ github.sha }}
        run: |
          set -euo pipefail
          sed -i -E "s#^( *newTag:).*#\1 \"$TAG\"#" overlays/dev/kustomization.yaml
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add overlays/dev/kustomization.yaml
          git diff --cached --quiet || git commit -m "Deploy $TAG"
          git push
```

Merge a text change in the app. Without touching the cluster, the new version should appear.

## Break it

1. Push invalid YAML → sync error in the UI.
2. Push an image tag that does not exist → app becomes Degraded; old pods keep serving.
3. Fix both with `git revert`, not with kubectl.

## Done when

- [ ] Merge → live on Kind with no manual command
- [ ] Self-heal and rollback seen
- [ ] CI has no cluster credentials

Next: [Phase 12](12-helm.md)
