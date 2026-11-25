# Phase 4: GitHub Actions CI/CD (Free on a public repo)

**Goal:** every pull request is checked; every merge to `main` publishes a Docker image automatically.

- **CI:** test and build every change.
- **CD:** deliver it automatically.
- **Workflow → job → step:** file → machine → command.
- **Runner:** the cloud machine that runs a job.

## Step 1: CI workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Push it on a branch, open a pull request, and watch the **Actions** tab.

## Step 2: Make it block bad code

GitHub → Settings → Rules → your ruleset → Require status checks → add `verify`.

Test it: break the test on a branch. Merge must be blocked.

## Step 3: Build and publish the image

Add this job to `ci.yml`, under `jobs:`. It calls a second workflow file, only after `verify` passes.

```yaml
  image:
    needs: verify
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    permissions:
      contents: read
      packages: write
    uses: ./.github/workflows/docker-build.yml
```

**File:** `.github/workflows/docker-build.yml`

```yaml
name: Docker build

on:
  workflow_call:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v6
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,format=long,prefix=
            type=raw,value=latest
      - uses: docker/build-push-action@v7
        with:
          context: .
          file: frontend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: VITE_APP_VERSION=${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

`GITHUB_TOKEN` is created automatically for each run. You do not create it.

## Step 4: Make the image public

GitHub → your profile → Packages → `devops-deployment-lab` → Package settings → Change visibility → **Public**. Later, EC2 and Kubernetes can pull it without a password.

Test in Ubuntu:

```bash
docker pull ghcr.io/<GITHUB_USER>/devops-deployment-lab:latest
docker run --rm -p 8080:8080 ghcr.io/<GITHUB_USER>/devops-deployment-lab:latest
```

The page shows the Git commit as its version.

## Step 5: Variables, secrets, environments

| Type | Use | Example |
|---|---|---|
| Variable (`vars.NAME`) | Not secret | region, bucket name |
| Secret (`secrets.NAME`) | Hidden in logs | token |
| Environment | Group with rules | `aws` with approval |

Create an environment named `aws`: Settings → Environments → New. Add yourself as **required reviewer** and allow only the `main` branch. You use it in phase 5.

## Why tag images with the commit SHA

`latest` changes all the time, so you cannot know what is running or roll back safely. Always **deploy the SHA tag**.

## Break it

1. Fail lint, test, and build one by one. Read each log.
2. Put wrong indentation in the YAML.
3. Remove `packages: write` and read the permission error.

## Done when

- [ ] A failing test blocks the merge
- [ ] Merging to `main` publishes an image with the commit SHA tag
- [ ] You can explain trigger, job, step, runner, secret

Next: [Phase 5](05-aws-fundamentals.md)
