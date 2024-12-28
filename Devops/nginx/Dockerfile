FROM nginx:alpine

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port the server listens on
EXPOSE 9090

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
