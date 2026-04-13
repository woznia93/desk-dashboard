#!/bin/bash
sleep 10

chromium-browser http://localhost:3000 \
  --kiosk \
  --incognito \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --start-fullscreen \
  --window-position=0,0 \
  --window-size=1920,1080 \
  --disable-translate \
  --no-first-run \
  --fast \
  --fast-start
