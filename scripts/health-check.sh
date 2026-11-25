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
