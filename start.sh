#!/bin/bash

TIMER_START=$(date +%s);
echo "Stopping running project...";
./stop.sh;
echo "Running projects stopped!";
echo "Starting old logs deletion...";
rm -rf ./logs/nginx/*;
echo "Old logs deleted!";
echo "Started building gamification...";
docker build -t gamification --no-cache .;
echo "Gamification-base builded!";
echo "Running project...";
echo "Users data in ./users-data";
echo "Nginx and project logs in ./logs/nginx";
docker run --restart always -d -p 80:80 -p 443:443 -v ./logs/nginx:/var/log/nginx -v ./data:/usr/share/nginx/html/data gamification;
echo "Averall downtime is $(( $(date +%s) - $TIMER_START )) seconds.";
echo "Waiting for nginx properly starts (10 seconds)...";
sleep 10s;
echo "Launching SSL certs installation/copy related script...";
./ssl_certs_initiation_script.sh;
echo "Launching SSL certs installation/copy related script completed!";
