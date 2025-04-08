#!/bin/bash

echo "Stoping gamification project...";
DOCKER_ID=$(docker ps -aqf "ancestor=gamification");
docker stop $DOCKER_ID;
echo "Gamification project terminated!";
