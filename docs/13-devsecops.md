# Phase 13: Security / DevSecOps (Free)

**Goal:** the pipeline finds security problems before deployment.

Add **one tool at a time**. Understand its report before adding the next.

| Tool | Finds | Free? |
|---|---|---|
| Dependabot | Old or vulnerable packages | Yes |
| Gitleaks | Passwords in Git | Yes |
| Trivy | Vulnerabilities in images and config | Yes |
| SonarQube Cloud | Code quality | Yes, public repos |
| OWASP ZAP | Problems in the running site | Yes |

## Step 1: GitHub settings

Settings → Advanced Security: turn on Dependabot alerts, Dependabot security updates, secret scanning, push protection.

**File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /frontend
    schedule:
      interval: weekly
  - package-ecosystem: docker
    directory: /frontend
    schedule:
      interval: weekly
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

## Step 2: Gitleaks

```bash
docker run --rm -v "$PWD:/repo" ghcr.io/gitleaks/gitleaks:v8.30.1 git /repo --verbose
```

When clean, add it to the pipeline.

**File:** `.github/workflows/security-scan.yml`

```yaml
name: Security scan

on:
  pull_request:
  schedule:
    - cron: "0 3 * * 1"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  secrets:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - run: docker run --rm -v "$PWD:/repo" ghcr.io/gitleaks/gitleaks:v8.30.1 git /repo --redact --verbose

  config:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v7
      - uses: aquasecurity/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25 # v0.36.0
        with:
          scan-type: config
          scan-ref: .
          severity: HIGH,CRITICAL
          exit-code: "0"
```

`config` checks Docker, Kubernetes and Terraform files. Exit code 0 means report only; change it to 1 after you fix the findings. Then add both jobs as required checks.

If a real secret is ever found: **first change the secret at its source**, then clean the code. Deleting the line is not enough, because Git history keeps it.

## Step 3: Trivy

In March 2026 attackers replaced most tags of the Trivy GitHub Action with malware that stole secrets. A tag can be moved; a commit SHA cannot. So pin by SHA.

In `docker-build.yml`, build first, scan, then push. Replace the single build step with:

```yaml
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: frontend/Dockerfile
          load: true
          tags: scan:local
          build-args: VITE_APP_VERSION=${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - uses: aquasecurity/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25 # v0.36.0
        with:
          image-ref: scan:local
          severity: HIGH,CRITICAL
          ignore-unfixed: true
          exit-code: "1"
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: frontend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: VITE_APP_VERSION=${{ github.sha }}
          cache-from: type=gha
```

Before using it, confirm the SHA on the action's [releases page](https://github.com/aquasecurity/trivy-action/releases). Then pin your other actions by SHA too; Dependabot can still update them.

## Step 4: Safer pods

Add to the pod spec:

```yaml
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
```

Add to the container:

```yaml
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
```

Nginx needs a writable `/tmp`, so add an `emptyDir` volume mounted at `/tmp`. Then enforce it:

```bash
kubectl label namespace lab pod-security.kubernetes.io/enforce=restricted
```

## Step 5: Security headers

Add to `nginx.conf`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy`.

Nginx detail: if a `location` has its own `add_header`, it **ignores** headers set outside it. Repeat them in each location, and check with `curl -I`.

## Step 6: SonarQube Cloud

Log in with GitHub, import the public repo, and turn on automatic analysis. Read the report; fix two issues.

## Step 7: OWASP ZAP

Scan **only your own site**:

```bash
docker run -d --name lab -p 8080:8080 ghcr.io/<GITHUB_USER>/devops-deployment-lab:latest
docker run --rm ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:8080
docker rm -f lab
```

## Step 8: Secrets and IAM

- Review `github-devops-lab` role: remove permissions you no longer use.
- Read about AWS Secrets Manager. Create one secret, read it with the CLI, delete it ($0.40 per month if kept).
- Write down where every secret in your project lives. Goal: almost none.

## Break it

1. Commit a fake key on a branch and see Gitleaks fail. Delete the branch.
2. Use an old base image and see Trivy block it.
3. Run a root container in namespace `lab` and see it rejected.

## Done when

- [ ] A vulnerable image cannot be published
- [ ] Pods run non-root with read-only filesystem
- [ ] Actions are pinned by SHA

Next: [Phase 14](14-monitoring.md)
