#!/bin/bash
# Keep-alive script that restarts the server when it dies
# Uses a Unix socket for faster startup

cd /home/z/my-project

while true; do
  node micro-server.mjs 2>&1 &
  SERVER_PID=$!
  
  # Wait for server to die
  while kill -0 $SERVER_PID 2>/dev/null; do
    sleep 1
  done
  
  echo "[$(date)] Server died, restarting..." >> /home/z/my-project/restart.log
  sleep 1
done
