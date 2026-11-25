# Phase 0: Setup (Free)

**Goal:** your Windows laptop is ready. You do not need an Ubuntu laptop; Ubuntu runs inside Windows through WSL2.

## What you already have

Checked on your laptop: Windows 11 Pro, 32 GB RAM, WSL2 with Ubuntu 26.04, VS Code, Git, Docker Desktop 28.3.2, Minikube, Node.js 20.

So only a few steps are left.

## Which terminal to use

| Work | Terminal |
|---|---|
| `npm`, `git`, `gh` | Windows PowerShell in `D:\devops\react-devops` |
| `docker`, `kubectl`, `kind`, `helm`, `aws`, `terraform`, Linux practice | Ubuntu in `/mnt/d/devops/react-devops` |

It is the same folder seen from two sides. **Do not run `npm install` in Ubuntu**: some packages are different for Windows and Linux, and mixing them breaks the app.

## Steps

### Step 1: Upgrade Node.js (PowerShell)

Node 20 is out of support, and the test tool we use needs a newer version.

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen PowerShell:

```powershell
node -v
npm -v
```

Expected: v24 or v26. If winget reports a conflict, uninstall the old Node.js in Windows Settings → Apps, then run it again.

If PowerShell says *running scripts is disabled*, use `npm.cmd` in place of `npm`.

### Step 2: Install GitHub CLI (PowerShell)

```powershell
winget install GitHub.cli
```

Reopen PowerShell:

```powershell
gh auth login
gh auth status
```

### Step 3: Set your Git name and email

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-github-email"
git config --global init.defaultBranch main
```

### Step 4: VS Code extensions

Install: **WSL**, **Docker**, **YAML**, **HashiCorp Terraform**, **GitHub Actions**.

### Step 5: Connect Docker to Ubuntu

1. Open Docker Desktop.
2. Settings → Resources → WSL integration.
3. Turn on **Ubuntu**, then Apply.

Open Ubuntu and check:

```bash
docker version
docker run --rm hello-world
```

### Step 6: Basic Ubuntu tools

```bash
sudo apt update
sudo apt install -y curl unzip jq git
cd /mnt/d/devops/react-devops
ls
```

You should see the `docs` folder.

### Step 7: Enable systemd in Ubuntu

Needed in phase 2 for `systemctl` and `journalctl`. Check first:

```bash
ps -p 1 -o comm=
```

If it does not print `systemd`, open the file with `sudo nano /etc/wsl.conf` and make sure it has:

```ini
[boot]
systemd=true
```

Then in PowerShell (save open work in Ubuntu first):

```powershell
wsl --shutdown
```

Restart Docker Desktop and Ubuntu.

### Tools to install later

| Tool | Phase |
|---|---|
| AWS CLI | 5 |
| kubectl, Kind | 7 |
| Helm | 8 |
| eksctl | 9 |
| Terraform | 10 |

## Done when

- [ ] `node -v` shows v24 or v26
- [ ] `gh auth status` shows you are logged in
- [ ] `docker run --rm hello-world` works in Ubuntu

Next: [Phase 1](01-app-and-git.md)
