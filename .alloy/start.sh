#!/usr/bin/env bash
# Start script for the Bit workspace inside the Alloy sandbox.
#
# This script:
#   1. Installs Bit via bvm (if not already installed in the cached HOME dir)
#   2. Runs `bit install` to install pnpm-managed component dependencies
#   3. Starts the Bit workspace dev server on port 3000
#
# HOME is overridden in docker-compose.alloy.yaml to /workspace/.alloy/home so
# bvm/bit binaries and their caches persist between container restarts via the
# mounted workspace volume.

set -euo pipefail

cd /workspace

# Ensure HOME exists and bvm bin is on PATH for the rest of the script.
mkdir -p "${HOME}"
export PATH="${HOME}/bin:${HOME}/.bvm/bin:${PATH}"

# Install bvm and bit if not already cached.
if ! command -v bvm >/dev/null 2>&1; then
  echo "[alloy] installing @teambit/bvm globally..."
  npm install -g @teambit/bvm
fi

if ! command -v bit >/dev/null 2>&1; then
  echo "[alloy] installing bit via bvm..."
  bvm install
fi

# Make sure bit binary is on PATH after bvm install.
export PATH="${HOME}/bin:${HOME}/.bvm/bin:${PATH}"

# Disable Bit's interactive analytics prompt - it blocks non-interactive runs.
# Setting analytics_reporting to false (and anonymous_reporting to false)
# suppresses the prompt entirely.
bit config set analytics_reporting false >/dev/null 2>&1 || true
bit config set anonymous_reporting false >/dev/null 2>&1 || true
bit config set no_warnings true >/dev/null 2>&1 || true

# Install workspace component dependencies. `bit install` uses pnpm under the
# hood and is idempotent — safe to re-run.
echo "[alloy] running bit install..."
bit install

# Start the Bit workspace dev server. It serves the workspace UI on port 3000
# (component browser, compositions, docs) and runs the workspace's apps on
# adjacent ports starting at 3100. The Alloy preview lands on the workspace
# UI by default; navigate to /markec.mototrack/apps/mototrack-prototype to view
# the mototrack-prototype app preview.
echo "[alloy] starting bit dev server..."
exec bit start --port 3000
