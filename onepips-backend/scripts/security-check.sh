#!/usr/bin/env bash

set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:3001/api}"
FRONTEND_URL="${FRONTEND_URL:-http://host.docker.internal:3000}"

echo "=== Backend headers ==="
curl -sSI "$BACKEND_URL/health" || true

echo
echo "=== Frontend headers ==="
curl -sSI "$FRONTEND_URL/admin/login" || true

echo
echo "=== Expected security headers ==="

check_header() {
  local url="$1"
  local header="$2"

  if curl -sSI "$url" | grep -qi "^${header}:"; then
    echo "✅ $header"
  else
    echo "❌ $header"
  fi
}

check_header "$BACKEND_URL/health" "X-Content-Type-Options"
check_header "$BACKEND_URL/health" "X-Frame-Options"
check_header "$BACKEND_URL/health" "Referrer-Policy"

check_header "$FRONTEND_URL/admin/login" "X-Content-Type-Options"
check_header "$FRONTEND_URL/admin/login" "X-Frame-Options"
check_header "$FRONTEND_URL/admin/login" "Referrer-Policy"

# chmod +x scripts/security-check.sh
# ./scripts/security-check.sh