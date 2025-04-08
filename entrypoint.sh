#!/bin/sh

# Start nginx in the background
nginx #-g "daemon off;"

# Tail the log files so that their content is output to Docker logs.
tail -F /var/log/nginx/access.log /var/log/nginx/error.log
