# Project Structure

Your structure, with the phase where each part is filled. The folders exist now; the files are written in their phase. Git does not save empty folders, so each has a `.gitkeep` file. Delete it when you add the first real file. `aws/` and `terraform/bootstrap/` are created in phases 5 and 10.

GitHub repo name: `devops-deployment-lab`. Local folder: `D:\devops\react-devops`.

```text
devops-deployment-lab/
│
├── frontend/                       # Phase 1
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/             # when you have a second component
│   │   ├── App.tsx
│   │   ├── App.test.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile                  # Phase 3
│
├── docker/                         # Phase 3
│   ├── docker-compose.yml
│   └── nginx/
│       └── nginx.conf
│
├── .github/
│   ├── dependabot.yml              # Phase 13
│   └── workflows/
│       ├── ci.yml                  # Phase 4: lint, test, build
│       ├── docker-build.yml        # Phase 4: image to GHCR
│       ├── deploy.yml              # Phase 5 (S3), Phase 6 (EC2)
│       └── security-scan.yml       # Phase 13
│
├── aws/                            # Phase 5: IAM policy files
│   └── eks-cluster.yaml            # Phase 9
│
├── k8s/                            # Phases 7-8
│   ├── kind-cluster.yaml
│   ├── base/
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   ├── ingress.yaml
│   │   └── hpa.yaml
│   └── overlays/
│       ├── dev/                    # Kind
│       ├── staging/                # Kind
│       └── production/             # EKS (Phase 9)
│
├── terraform/                      # Phase 10
│   ├── bootstrap/                  # state bucket
│   ├── modules/
│   │   ├── vpc/
│   │   ├── ec2/
│   │   ├── s3/
│   │   ├── ecr/
│   │   └── eks/
│   └── environments/
│       ├── dev/                    # the only one you apply
│       ├── staging/                # plan only, costs money
│       └── production/             # plan only, costs money
│
├── argocd/                         # Phase 11
│   ├── applications/
│   │   └── frontend.yaml
│   └── projects/
│       └── lab.yaml
│
├── helm/                           # Phase 12
│   └── frontend/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       ├── values-prod.yaml
│       └── templates/
│
├── monitoring/                     # Phase 14
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
│
├── ansible/                        # Phase 16
│   ├── inventory/
│   ├── playbooks/
│   └── roles/
│
├── scripts/
│   ├── health-check.sh             # Phase 2
│   ├── build.sh                    # Phase 3
│   ├── deploy.sh                   # Phase 8
│   └── cleanup.sh                  # Phase 9
│
├── docs/                           # this guide (below)
│
├── .dockerignore                   # Phase 3
├── .gitattributes                  # Phase 1
├── .gitignore                      # Phase 1
├── .editorconfig                   # Phase 1
├── README.md                       # Phase 1, finished in Phase 18
└── LICENSE                         # Phase 1
```

## Docs folder

Guides are directly in `docs/`, named by phase number.

```text
docs/
├── README.md                       # start here: the full plan
├── PROJECT-STRUCTURE.md            # this file
├── PROGRESS.md
├── COST-GUIDE.md
├── 00-setup.md ... 17-18-final-project.md
├── architecture.md
└── common-errors.md
```

## Small changes to your structure

| Your structure | Now | Reason |
|---|---|---|
| `docker/.dockerignore` | `.dockerignore` in the root | Docker reads it only from the build folder, which is the root. In `docker/` it would be ignored |
| `docker/nginx/nginx.conf` with `frontend/Dockerfile` | Kept, but we build from the root | A build can only copy files inside its build folder |
| `k8s/base` and `overlays` | Added `kustomization.yaml` in each | Overlays need Kustomize (built into kubectl) |
| No place for IAM files | Added `aws/` | Needed in phases 5, 6 and 9 |
| No place for Terraform state setup | Added `terraform/bootstrap/` | State bucket must exist before the environments |
| Argo CD manifests in the same repo | `argocd/` kept, plus a second repo `devops-deployment-lab-gitops` | CI commits image tags there, so it does not push to protected `main` |
