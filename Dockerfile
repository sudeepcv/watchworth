# Build stage
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite.js project
RUN npm run build

# Prepare stage for runtime environment
FROM httpd:2.4

# Copy the built files from the build stage to the httpd server
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Set permissions to allow writing in OpenShift
RUN chmod -R 777 /usr/local/apache2/htdocs/assets

# Modify the Apache configuration to listen on port 8080
RUN sed -i 's/Listen 80/Listen 8080/' /usr/local/apache2/conf/httpd.conf

# Set the ServerName to avoid the warning
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

# Change the PID and log directories to /tmp to avoid permission issues in OpenShift
RUN sed -i 's|ErrorLog "logs/error_log"|ErrorLog "/tmp/error_log"|' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's|CustomLog "logs/access_log"|CustomLog "/tmp/access_log"|' /usr/local/apache2/conf/httpd.conf && \
    echo "PidFile /tmp/httpd.pid" >> /usr/local/apache2/conf/httpd.conf

# Copy the entrypoint script and make it executable
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh




# Expose port 8080 to serve the application
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]


