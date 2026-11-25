# Phase 12: Helm (Free)

**Goal:** one set of templates, different values for dev and prod.

| Word | Meaning |
|---|---|
| Chart | Package of templates |
| Values | Settings |
| Release | One installed chart |
| Revision | Version of a release, used for rollback |

## Step 1: Create the chart

```bash
helm create helm/frontend
```

Look at what it made, then delete everything in `helm/frontend/templates/` and write your own simple files. You learn more this way.

**File:** `helm/frontend/values.yaml`

```yaml
replicas: 2
image:
  repository: ghcr.io/<GITHUB_USER>/devops-deployment-lab
  tag: ""
environment: dev
ingress:
  enabled: true
  className: traefik
resources:
  requests:
    cpu: 25m
    memory: 32Mi
  limits:
    memory: 128Mi
```

**File:** `helm/frontend/values-dev.yaml`

```yaml
replicas: 2
environment: dev
```

**File:** `helm/frontend/values-prod.yaml`

```yaml
replicas: 3
environment: prod
```

## Step 2: Templates

Copy your `k8s/base/` files into `templates/` (not the namespace or kustomization) and replace fixed text:

| Fixed | Template |
|---|---|
| `name: frontend` | `name: {{ .Release.Name }}` |
| `app: frontend` label | `app: {{ .Release.Name }}` |
| `name: frontend-config` | `name: {{ .Release.Name }}-config` |
| `minReplicas: 2` in the HPA | `minReplicas: {{ .Values.replicas }}` |
| `image: frontend` | `image: "{{ .Values.image.repository }}:{{ required "image.tag is required" .Values.image.tag }}"` |
| `"local"` in config.json | `{{ .Values.environment | quote }}` |
| ingress class | `ingressClassName: {{ .Values.ingress.className }}` |
| resources | `{{- toYaml .Values.resources | nindent 12 }}` |

Put the whole ingress file between `{{- if .Values.ingress.enabled }}` and `{{- end }}`.

To restart pods when the ConfigMap changes, add to the pod template metadata:

```yaml
annotations:
  checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
```

## Step 3: Check before installing

```bash
helm lint helm/frontend --set image.tag=<SHA>
helm template dev helm/frontend --set image.tag=<SHA>
```

Read the output. It must look like your original YAML.

## Step 4: Install, upgrade, rollback

```bash
helm install dev helm/frontend -n dev --create-namespace -f helm/frontend/values-dev.yaml --set image.tag=<SHA>
helm install prod helm/frontend -n prod --create-namespace -f helm/frontend/values-prod.yaml --set image.tag=<SHA> --set ingress.enabled=false
helm list -A
helm upgrade dev helm/frontend -n dev -f helm/frontend/values-dev.yaml --set image.tag=<OTHER_SHA>
helm history dev -n dev
helm rollback dev 1 -n dev
```

Only one release has Ingress on because both would use the same `/` path.

## Step 5: Argo CD with Helm

Uninstall the manual releases, move the chart to the GitOps repo, and change the Application source:

```yaml
  source:
    repoURL: https://github.com/<GITHUB_USER>/devops-deployment-lab-gitops.git
    targetRevision: main
    path: charts/frontend
    helm:
      valueFiles:
        - values.yaml
        - values-dev.yaml
```

Change the CI job to update `tag:` in `charts/frontend/values.yaml` in place of `newTag:` in the overlay.

With Argo CD, roll back through `git revert`, not `helm rollback`.

## Break it

1. Install without `image.tag`. Read the error.
2. Use wrong `nindent` and read the YAML error.

## Done when

- [ ] dev and prod run from one chart
- [ ] Upgrade and rollback work
- [ ] Argo CD deploys the chart

Next: [Phase 13](13-devsecops.md)
