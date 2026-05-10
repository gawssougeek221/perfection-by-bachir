#!/bin/bash
cd /home/z/my-project
while true; do
  node micro-server.mjs 2>/dev/null
  sleep 0.3
done
