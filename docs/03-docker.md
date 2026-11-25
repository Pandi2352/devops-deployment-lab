# Phase 3: Docker (Free)

**Goal:** the app runs in a small, production-style container.

- **Image:** a packaged app (the recipe result).
- **Container:** a running image.
- **Registry:** where images are stored.

Use **Ubuntu** in `/mnt/d/devops/react-devops`.

## Step 1: Basic commands

```bash
docker pull nginx:stable-alpine
docker images
docker run -d --name web -p 8081:80 nginx:stable-alpine
docker ps
curl -I http://localhost:8081
docker logs web
docker exec -it web sh
docker stop web
docker rm web
```

`-p 8081:80` means laptop port 8081 → container port 80. Leave `exec` by typing `exit`.

## Step 2: Nginx configuration

**File:** `docker/nginx/nginx.conf`

```nginx
server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;

    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 "ok\n";
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }
}
```

## Step 3: Dockerfile (multi-stage)

**File:** `frontend/Dockerfile`

```dockerfile
FROM node:26-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_APP_VERSION=dev
ENV VITE_APP_VERSION=$VITE_APP_VERSION
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
```

The Dockerfile uses files from both `frontend/` and `docker/`, so we always build from the **repo root** (the `.` at the end of the build command).

Stage 1 builds with Node. Stage 2 keeps only the built files and Nginx, so the image is small. This Nginx image does **not** run as root.

**File:** `.dockerignore` (in the repo root)

```text
**/node_modules
**/dist
**/.env*
**/.terraform
.git
docs
terraform
```

## Step 4: Build and run

```bash
docker build -f frontend/Dockerfile -t devops-lab:1.0 --build-arg VITE_APP_VERSION=1.0 .
docker run -d --name lab -p 8080:8080 devops-lab:1.0
curl http://localhost:8080/healthz
docker exec lab id
docker images devops-lab
docker history devops-lab:1.0
```

Open http://localhost:8080. It must show **Version: 1.0**. Change the text, build `2.0`, run it, and see the version change.

```bash
docker rm -f lab
```

If `npm ci` complains that the lock file does not match, run `npm install` in PowerShell inside `frontend` and build again.

## Step 5: Volumes and networks

```bash
docker volume create data
docker run --rm -v data:/data alpine sh -c 'echo saved > /data/a.txt'
docker run --rm -v data:/data alpine cat /data/a.txt

docker network create labnet
docker run -d --name lab --network labnet devops-lab:1.0
docker run --rm --network labnet alpine wget -qO- http://lab:8080/healthz
```

The file survives because it is in the volume. Containers on the same network find each other **by name**. Clean up:

```bash
docker rm -f lab
docker network rm labnet
docker volume rm data
```

## Step 6: Docker Compose

**File:** `docker/docker-compose.yml`

```yaml
services:
  frontend:
    build:
      context: ..
      dockerfile: frontend/Dockerfile
      args:
        VITE_APP_VERSION: compose
    image: devops-lab:compose
    ports:
      - "8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
```

```bash
docker compose -f docker/docker-compose.yml up -d --build
docker compose -f docker/docker-compose.yml ps
docker compose -f docker/docker-compose.yml logs
docker compose -f docker/docker-compose.yml down
```

**File:** `scripts/build.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
version="${1:?Usage: ./scripts/build.sh <version>}"
docker build -f frontend/Dockerfile -t "devops-lab:$version" --build-arg "VITE_APP_VERSION=$version" .
```

## Step 7: Docker Hub

Create a free account at hub.docker.com, then:

```bash
docker login
docker tag devops-lab:1.0 <DOCKERHUB_USER>/devops-lab:1.0
docker push <DOCKERHUB_USER>/devops-lab:1.0
docker rmi <DOCKERHUB_USER>/devops-lab:1.0
docker pull <DOCKERHUB_USER>/devops-lab:1.0
```

## Break it

1. Delete the `COPY --from=build` line, run it, see what page appears.
2. Run two containers on port 8080. Read the error.
3. Move `COPY frontend/ ./` above `RUN npm ci`. Change one line in the app, build again, and notice the slower build. Put it back. This is **layer caching**.

Useful debugging: `docker logs`, `docker exec -it <name> sh`, `docker inspect`, `docker system df`.

## Done when

- [ ] The app runs at http://localhost:8080 with the correct version
- [ ] `docker exec lab id` does not show uid 0 (root)
- [ ] You can explain image vs container vs volume vs network
- [ ] All files are committed through a pull request

Next: [Phase 4](04-github-actions.md)
