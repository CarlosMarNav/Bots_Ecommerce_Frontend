FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY sendingbay-ui.css /usr/share/nginx/html/sendingbay-ui.css
COPY logo-sendingbay.png /usr/share/nginx/html/logo-sendingbay.png
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
