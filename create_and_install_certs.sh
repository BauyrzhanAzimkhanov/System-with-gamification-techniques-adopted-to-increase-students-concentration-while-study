#!/bin/bash

# Generate SSL certificate if not existing
if [ ! -f /etc/nginx/fullchain.pem ] && [ ! -f /usr/share/nginx/html/data/ssl/fullchain.pem ];
then
    echo "There is no installed certs!";
    echo "Starting certs creation and installation process...";
    echo "Requesting new SSL certs from Let's Encrypt...";
    certbot certonly --webroot -w /usr/share/nginx/html -d gamification.kz --non-interactive --agree-tos --register-unsafely-without-email;
    echo "Certs from Let's Encrypt recieved!";
    echo "Moving recieved certs from temp to /etc/nginx directory...";
    cp /etc/letsencrypt/live/gamification.kz/fullchain.pem /etc/nginx/fullchain.pem;
    cp /etc/letsencrypt/live/gamification.kz/privkey.pem /etc/nginx/privkey.pem;
    echo "Moved certs from temp to /etc/nginx directory!";
    echo "Removing comments from default.conf and adding 443 with certs...";
    sed -i 's/#//g' /etc/nginx/conf.d/default.conf;
    echo "default.conf now support 443!";
    echo "Reloading nginx...";
    nginx -s reload;
    echo "Nginx reloaded!";
elif [ ! -f /etc/nginx/fullchain.pem ] && [ -f /usr/share/nginx/html/data/ssl/fullchain.pem ];
then
    echo "Moving cached certs from PROJECT_WORKDIR/data/ssl to /etc/nginx directory...";
    cp /usr/share/nginx/html/data/ssl/fullchain.pem /etc/nginx/fullchain.pem;
    cp /usr/share/nginx/html/data/ssl/privkey.pem /etc/nginx/privkey.pem;
    echo "Moved certs from temp to /etc/nginx directory!";
    echo "Removing comments from default.conf and adding 443 with certs...";
    sed -i 's/#//g' /etc/nginx/conf.d/default.conf;
    echo "default.conf now support 443!";
    echo "Reloading nginx...";
    nginx -s reload;
    echo "Nginx reloaded!";
else
    echo "Certs already installed!";
fi;
