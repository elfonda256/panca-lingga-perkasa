# Production Nginx Image for PT Panca Lingga Perkasa
FROM nginx:alpine

# Copy static assets to default Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
