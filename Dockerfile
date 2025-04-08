FROM gamification-base:latest

COPY . /usr/share/nginx/html
RUN chown -R root /usr/share/nginx/html && \
    chmod -R 777 /usr/share/nginx/html 

EXPOSE 80 443
CMD ["/entrypoint.sh"]
