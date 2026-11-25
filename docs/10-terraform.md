# Phase 10: Terraform (Tool free, AWS resources paid)

**Goal:** create and delete AWS infrastructure from code. No clicking.

| Word | Meaning |
|---|---|
| Provider | Plugin for AWS |
| Resource | Thing to create |
| Data source | Thing to read |
| Variable / output | Input / result |
| State | Terraform's memory of what it created |
| Module | Reusable group of resources |

`modules/` = reusable parts. `environments/` = where you run Terraform.

**Apply only `dev`.** Applying staging and production too would triple the cost.

## Step 1: Install (Ubuntu)

```bash
curl -fsSLo /tmp/tf.zip https://releases.hashicorp.com/terraform/1.17.2/terraform_1.17.2_linux_amd64.zip
unzip -qo /tmp/tf.zip -d /tmp/tf
sudo install -m 0755 /tmp/tf/terraform /usr/local/bin/terraform
terraform version
```

Give Terraform your temporary AWS login (repeat when it expires):

```bash
aws login --remote
eval "$(aws configure export-credentials --format env)"
```

## Step 2: First module, S3

**File:** `terraform/modules/s3/main.tf`

```hcl
variable "name" {
  type = string
}

resource "aws_s3_bucket" "this" {
  bucket = var.name
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket" {
  value = aws_s3_bucket.this.bucket
}
```

## Step 3: State bucket

**File:** `terraform/bootstrap/main.tf`

```hcl
terraform {
  required_version = ">= 1.11"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

variable "region" {
  type = string
}

variable "bucket_name" {
  type = string
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { project = "devops-lab" }
  }
}

module "state" {
  source = "../modules/s3"
  name   = var.bucket_name
}

output "bucket" {
  value = module.state.bucket
}
```

```bash
cd terraform/bootstrap
terraform init
terraform fmt
terraform validate
terraform plan -var region=<REGION> -var bucket_name=<UNIQUE_NAME>
terraform apply -var region=<REGION> -var bucket_name=<UNIQUE_NAME>
terraform state list
```

Always read the plan before typing `yes`. Commit `.terraform.lock.hcl`. Never commit state files. This small bootstrap state stays on your laptop.

## Step 4: More modules

**File:** `terraform/modules/vpc/main.tf`

```hcl
variable "name" {
  type = string
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name                    = var.name
  cidr                    = "10.0.0.0/16"
  azs                     = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnets          = ["10.0.1.0/24", "10.0.2.0/24"]
  map_public_ip_on_launch = true
  enable_nat_gateway      = false
  public_subnet_tags      = { "kubernetes.io/role/elb" = "1" }
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnets" {
  value = module.vpc.public_subnets
}
```

**File:** `terraform/modules/ecr/main.tf`

```hcl
variable "name" {
  type = string
}

resource "aws_ecr_repository" "this" {
  name                 = var.name
  image_tag_mutability = "IMMUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "url" {
  value = aws_ecr_repository.this.repository_url
}
```

`force_delete` lets destroy remove a repository that still has images. Fine for a lab, not for production.

**File:** `terraform/modules/eks/main.tf`

```hcl
variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.name
  kubernetes_version = "1.36"
  vpc_id             = var.vpc_id
  subnet_ids         = var.subnet_ids

  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  addons = {
    vpc-cni                = { before_compute = true }
    kube-proxy             = {}
    coredns                = {}
    eks-pod-identity-agent = { before_compute = true }
  }

  eks_managed_node_groups = {
    workers = {
      instance_types = ["c7i-flex.large"]
      min_size       = 1
      max_size       = 3
      desired_size   = 2
    }
  }
}
```

**`terraform/modules/ec2/`** is your exercise: write it yourself. Inputs: name, subnet, instance type. Resources: security group (80 and 443 open, no port 22), IAM role with `AmazonSSMManagedInstanceCore`, instance profile, and the instance. Connect through SSM.

## Step 5: Dev environment

**File:** `terraform/environments/dev/main.tf`

```hcl
terraform {
  required_version = ">= 1.11"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  backend "s3" {
    bucket       = "<STATE_BUCKET>"
    key          = "dev/terraform.tfstate"
    region       = "<REGION>"
    use_lockfile = true
  }
}

variable "region" {
  type = string
}

variable "create_eks" {
  type    = bool
  default = false
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      project     = "devops-lab"
      environment = "dev"
    }
  }
}

module "vpc" {
  source = "../../modules/vpc"
  name   = "devops-lab-dev"
}

module "ecr" {
  source = "../../modules/ecr"
  name   = "devops-lab"
}

module "eks" {
  count      = var.create_eks ? 1 : 0
  source     = "../../modules/eks"
  name       = "devops-lab"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnets
}

output "ecr_url" {
  value = module.ecr.url
}
```

```bash
cd ../environments/dev
terraform init
terraform plan -var region=<REGION>
terraform apply -var region=<REGION>
```

This makes only a VPC (free) and an empty ECR repository. Practice here: change a tag, plan, apply, look in the console.

## Step 6: EKS session (PAID, same rules as phase 9)

```bash
terraform plan -var region=<REGION> -var create_eks=true
terraform apply -var region=<REGION> -var create_eks=true
aws eks update-kubeconfig --name devops-lab --region <REGION>
kubectl get nodes
```

## Step 7: Staging and production

Copy `dev` to `staging` and `production`. Change the state `key`, the `environment` tag, and the names. Run only `terraform plan`. Do not apply.

## Step 8: Terraform in GitHub Actions

1. On pull request: `fmt -check -recursive`, `init -backend=false`, `validate`. No AWS access needed.
2. Manual workflow: `plan` using OIDC, with a **separate role** from the deploy role.
3. Keep `apply` manual on your laptop until you understand plan well.

## Break it

1. Change a tag in the console, then `terraform plan`. This is **drift**.
2. Run two applies at the same time. See the lock error.
3. Try a wrong instance type and read the AWS error.

## Cleanup

Delete any Kubernetes Ingress first, then in `terraform/environments/dev`:

```bash
terraform destroy -var region=<REGION> -var create_eks=true
```

Keep the state bucket (almost free) until the project ends.

## Done when

- [ ] You can explain plan, apply, destroy, state, drift, module
- [ ] VPC and EKS created and destroyed from code
- [ ] You wrote the `ec2` module yourself
- [ ] State is in S3, not in Git

Next: [Phase 11](11-argocd-gitops.md)
