# CloudSync - Web Admin
# React App on Nginx
# Dockerfile

# Based on:
# https://rsbh.dev/blog/dockerize-react-app
# https://dev.to/karanpratapsingh/dockerize-your-react-app-4j2e

# Base image
# Using Alpine's official image with node, latest version
FROM node:16-alpine3.15 AS cloudsync-web-admin-base
# Installing required packages
RUN apk add --no-cache npm
# Adding a work directory
WORKDIR /app
# Caching and installing dependencies
COPY cloudsync-web-admin/package.json .
COPY cloudsync-web-admin/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts -g --silent
# Copying the app files
COPY cloudsync-web-admin/. .


# Builder image - generates production build
FROM cloudsync-web-admin-base as cloudsync-web-admin-builder
# Building the app
RUN npm run build


# Production image
# Using Alpine's official image with nginx, latest version
FROM nginx:1.23-alpine as cloudsync-web-admin-production
# Setting node environment variables
ENV NODE_ENV production
# Bundling static assets with nginx
# Copying built assets from builder image
COPY --from=cloudsync-web-admin-builder /app/build /usr/share/nginx/html
# Adding custom default.conf
COPY cloudsync-web-admin/nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template
# Exposing port
EXPOSE 3000
# Starting nginx
#CMD ["nginx", "-g", "daemon off;"]
#COPY ./nginx.conf.template /nginx.conf.template
CMD ["/bin/sh" , "-c" , "envsubst \\$PORT < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
