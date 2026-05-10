#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS="--max-old-space-size=1024" node .next/standalone/server.js 2>&1
  echo "Server crashed at $(date), restarting in 2s..."
  sleep 2
done
