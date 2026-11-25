#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
version="${1:?Usage: ./scripts/build.sh <version>}"
docker build -f frontend/Dockerfile -t "devops-lab:$version" --build-arg "VITE_APP_VERSION=$version" .