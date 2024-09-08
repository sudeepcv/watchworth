#!/bin/sh

# Replace placeholders in all .js files in the /usr/local/apache2/htdocs/assets/ directory
for file in /usr/local/apache2/htdocs/assets/*.js; do
  sed -i "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL}|g" "$file"
  sed -i "s|VITE_NOEMBED_URL_PLACEHOLDER|${VITE_NOEMBED_URL}|g" "$file"
done

# Start Apache
httpd-foreground
