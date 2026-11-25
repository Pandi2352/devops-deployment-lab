# Common Errors

Read the **full** error first. The last lines usually name the cause.

## Laptop

| Error | Cause | Fix |
|---|---|---|
| `running scripts is disabled` | PowerShell policy | Use `npm.cmd` |
| `Cannot find module ... native binding` | `npm install` was run in both Windows and Ubuntu | Delete `node_modules`, run `npm install` in PowerShell only |
| `bad interpreter: ^M` | Windows line endings | Check `.gitattributes`; run `sed -i 's/\r$//' file.sh` |
| `Permission denied` running a script | Not executable | `chmod +x script.sh` |
| `Cannot connect to the Docker daemon` | Docker Desktop is off, or WSL integration is off | Start it; phase 0, step 5 |
| `docker-credential-desktop.exe: not found` | WSL integration problem | Restart Docker Desktop, then `wsl --shutdown` |

## Git and GitHub

| Error | Cause | Fix |
|---|---|---|
| `non-fast-forward` | Remote has newer commits | `git pull --rebase`, then push |
| `GH013: Repository rule violations` | Direct push to `main` | Use a pull request |
| `merge conflict` | Same line changed twice | Edit the file, `git add`, `git commit` |
| Password in a commit | Mistake | Change that password **first**, then clean Git |

## Docker

| Error | Cause | Fix |
|---|---|---|
| `port is already allocated` | Port in use | `docker ps`, stop the other one |
| `npm ci ... not in sync` | Lock file is old | `npm install` in PowerShell, commit the lock file |
| `COPY failed ... not found` | Wrong build folder | Build from the repo root with `-f frontend/Dockerfile .` |
| Page shows Nginx welcome | Files not copied | Check `COPY --from=build` |

## GitHub Actions

| Error | Cause | Fix |
|---|---|---|
| `Resource not accessible by integration` | Missing `permissions` | Add the needed permission |
| `denied: permission_denied: write_package` | No `packages: write` | Add it; check package access settings |
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` | Trust policy does not match | Check IDs, repo name, environment name, `aud` |
| `Credentials could not be loaded` | No `id-token: write` | Add it |
| `invalid reference format` | Uppercase in image name | Use lowercase |

## AWS

| Error | Cause | Fix |
|---|---|---|
| `ExpiredToken` | Login ended | `aws login --remote` |
| `AccessDenied` | Missing permission | The message names the action; add only that |
| `InvalidParameterCombination ... not eligible for Free Tier` | Free plan blocks this type | Use a free-tier-eligible type |
| Browser timeout | Security group or network | Check the port rule |
| 502 Bad Gateway | App behind the proxy is down | Check the container |
| CloudFront shows old page | Cache | Create an invalidation |
| CloudFront 403 | Wrong origin access or default object | Check bucket policy and `index.html` |

## Kubernetes

| Status | Meaning | First command |
|---|---|---|
| `Pending` | No space, or storage missing | `kubectl describe pod` |
| `ImagePullBackOff` | Wrong image, or private | `kubectl describe pod` |
| `CrashLoopBackOff` | App exits | `kubectl logs --previous` |
| `OOMKilled` | Memory limit too low | `kubectl describe pod` |
| `CreateContainerConfigError` | ConfigMap or Secret missing | `kubectl describe pod` |
| Running, not Ready | Readiness probe fails | `kubectl describe pod` |
| Service has no traffic | Selector does not match | `kubectl get endpointslices` |
| `connection refused` from kubectl | Cluster off, or wrong context | `kubectl config get-contexts` |
| HPA shows `<unknown>` | metrics-server missing | `kubectl get pods -n kube-system` |

**Before every kubectl command that changes something, run `kubectl config current-context`.** Be sure you are on Kind, not EKS.

## Terraform

| Error | Cause | Fix |
|---|---|---|
| `No valid credential sources` | Not logged in | Phase 10, step 1 |
| `Error acquiring the state lock` | Another run is active | Wait. Use `force-unlock` only when sure nothing is running |
| `DependencyViolation` on destroy | A load balancer still uses the VPC | Delete the Ingress or load balancer, then destroy |

## My errors

| Date | Error | Cause | Fix |
|---|---|---|---|
| | | | |
