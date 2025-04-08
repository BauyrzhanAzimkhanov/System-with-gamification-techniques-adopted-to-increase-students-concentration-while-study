#!/bin/bash

echo "Starting users data deletion...";
rm ./data/achievements_*
rm ./data/sessions_*
rm ./data/tasks_*
rm -rf ./data/[0-9]*
echo "Users data deleted!";

echo "Starting nginx logs deletion...";
rm ./logs/nginx/access.log;
rm ./logs/nginx/error.log;
echo "Nginx logs deleted!";
