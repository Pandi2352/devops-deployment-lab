# Phase 2: Linux (Free)

**Goal:** you can work on a Linux server using only the terminal. Servers and containers both run Linux.

Use **Ubuntu (WSL)**. Practice in `~/lab`:

```bash
mkdir -p ~/lab && cd ~/lab
```

## Day 1: Files

| Folder | Contains |
|---|---|
| `/etc` | Configuration |
| `/var/log` | Logs |
| `/home` | User files |
| `/opt` | Extra software |
| `/tmp` | Temporary files |

```bash
pwd
ls -lah
echo "hello devops" > note.txt
cat note.txt
cp note.txt copy.txt
mv copy.txt renamed.txt
rm renamed.txt
find /etc -name "*.conf" 2>/dev/null | head
grep -rn "hello" .
head /etc/passwd
df -h
du -sh ~/lab
```

## Day 2: Permissions

```bash
ls -l note.txt
chmod 600 note.txt
chmod u+x note.txt
whoami
id
sudo chown root note.txt
ls -l note.txt
sudo chown $USER note.txt
```

Learn: `r`=4, `w`=2, `x`=1. Order is owner, group, others. So `640` = owner read+write, group read, others nothing.

Why it matters: an SSH key must be `600`, and containers should not run as root.

## Day 3: Processes and services

```bash
ps aux | head
top
sleep 300 &
jobs
kill %1
free -h
sudo apt update
sudo apt install -y nginx
systemctl status nginx
sudo systemctl stop nginx
sudo systemctl start nginx
curl -I http://localhost
```

## Day 4: Networking

```bash
ip addr
ping -c 3 google.com
ss -tlnp
curl -I https://github.com
sudo apt install -y dnsutils
dig github.com +short
```

| Port | Use |
|---|---|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 8080 | Our container |

## Day 5: SSH

```bash
ssh-keygen -t ed25519 -C "devops-lab"
ls -l ~/.ssh
cat ~/.ssh/id_ed25519.pub
```

The `.pub` file can be shared. The other file is **private**: never share or commit it.

## Day 6: Logs and packages

```bash
sudo tail -f /var/log/nginx/access.log
```

Open a second terminal, run `curl http://localhost`, and watch the log. Then:

```bash
journalctl -u nginx --since "10 minutes ago"
apt list --upgradable
apt show nginx
```

## Day 7: First shell script

**File:** `scripts/health-check.sh` (in the project, `cd /mnt/d/devops/react-devops` first)

```bash
#!/usr/bin/env bash
set -euo pipefail

url="${1:?Usage: ./scripts/health-check.sh <url>}"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url" || true)

if [[ "$code" == "200" ]]; then
  echo "OK: $url"
else
  echo "FAILED: $url returned $code"
  exit 1
fi
```

```bash
chmod +x scripts/health-check.sh
./scripts/health-check.sh http://localhost
./scripts/health-check.sh http://localhost/missing
```

Files on the Windows drive may not save the executable flag in Git. After `git add`, run `git update-index --chmod=+x scripts/health-check.sh` in PowerShell. Do the same for later scripts.

You will reuse this idea as a health check in CI/CD.

## Break it

1. Stop nginx, run the script, read the error, start nginx.
2. `sudo chmod 000 /var/www/html/index.nginx-debian.html`, see the 403 error, find it in `/var/log/nginx/error.log`, fix with `chmod 644`.
3. Add a wrong word in `/etc/nginx/nginx.conf`, run `sudo nginx -t`, read the message, undo it.

When finished: `sudo systemctl disable --now nginx` so port 80 is free.

## Done when

- [ ] You can explain `chmod 640`
- [ ] You can find which program uses a port
- [ ] You can find why a service failed from its logs
- [ ] The script works

Next: [Phase 3](03-docker.md)
