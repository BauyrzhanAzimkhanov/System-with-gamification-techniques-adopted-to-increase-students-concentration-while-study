#!/bin/sh

echo "Started building gamification-base...";
docker build -t gamification-base --no-cache -f Dockerfile-base .;
echo "Gamification-base builded!";
