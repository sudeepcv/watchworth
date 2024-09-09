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
FROM httpd:alpine3.20

# Copy the built files from the build stage to the httpd server
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/



# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh




# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port 8080 to serve the application
EXPOSE 80
