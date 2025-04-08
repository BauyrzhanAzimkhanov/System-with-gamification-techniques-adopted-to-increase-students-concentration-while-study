#!/bin/bash

echo "Connecting to gamification project container...";
docker exec -it -w /usr/share/nginx/html $(docker ps -aqf "ancestor=gamification") bash;
echo "Disconnected from project container!";
