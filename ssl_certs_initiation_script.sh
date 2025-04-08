#!/bin/bash

echo "Checking and possibly installing certs on their absence...";
docker exec -w /usr/share/nginx/html $(docker ps -aqf "ancestor=gamification") bash ./create_and_install_certs.sh; 
echo "Checked SSL certs!";
