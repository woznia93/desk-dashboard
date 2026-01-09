#!/bin/bash
# wait for 10 seconds to make sure server is ready

sleep 10
chromium-browser http://localhost:3000 --kiosk --incognito --noerrdialogs --disable-infobars

