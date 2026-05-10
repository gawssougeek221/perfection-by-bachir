#!/bin/bash
cd /home/z/my-project
while true; do
  caddy run --config serve-Caddyfile --adapter caddyfile 2>/dev/null
  sleep 0.5
done
