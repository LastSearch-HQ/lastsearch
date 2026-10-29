#!/bin/bash
set -e

echo "=== Building for Vercel (Build Output API v3) ==="

# Clean ALL output directories
rm -rf .vercel/output dist

# 1. Create output structure
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/api/mcp.func

# 2. Build Vite frontend directly into .vercel/output/static
echo "Step 1: Building frontend..."
node scripts/fetch-contributors.mjs
pnpm exec vite build --outDir .vercel/output/static

# 3. Bundle MCP function (HTTP-only, calls engine API)
echo "Step 2: Bundling MCP function..."
pnpm exec esbuild api/mcp.ts \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=cjs \
  --outfile=.vercel/output/functions/api/mcp.func/index.js \
  --packages=bundle

# 4. MCP function config
cat > .vercel/output/functions/api/mcp.func/.vc-config.json << 'EOF'
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "maxDuration": 300,
  "supportsResponseStreaming": true
}
EOF

# 5. Route config — /api/mcp served locally, /api/* proxied to engine
ENGINE_URL="${ENGINE_URL:-https://api.lastsearch.ai}"
cat > .vercel/output/config.json << CONF
{
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com; font-src 'self' data:; connect-src 'self' https://mobaurkcqvfxhakwpnfw.supabase.co wss://mobaurkcqvfxhakwpnfw.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
      },
      "continue": true
    },
    { "src": "/api/mcp", "dest": "/api/mcp" },
    { "src": "/api/(.*)", "dest": "${ENGINE_URL}/api/\$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
CONF

# 6. Write build verification file
echo '{"built":true}' > .vercel/output/static/_build-info.json

# 7. Ensure NO dist/ directory exists (Vercel might use it instead)
rm -rf dist

echo "=== Build complete ==="
echo "Static:" && ls .vercel/output/static/
echo "MCP Function:" && ls .vercel/output/functions/api/mcp.func/
echo "Config:" && cat .vercel/output/config.json
