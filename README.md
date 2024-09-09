
# Watchworth Frontend

## Overview

The Watchworth Frontend is a React application that interacts with the Watchworth backend. This README provides instructions for building, running, and deploying the frontend application using Docker and Kubernetes.

## Building the Docker Image

To build the Docker image for the frontend, use the following command:

```bash
docker build -t cvsudeep/watchworthreact .
```

## Running the Docker Container

To run the frontend in a Docker container with the required environment variables, use the following command:

```bash
docker run \
  --name watchworthreact \
  -e VITE_API_URL=http://localhost:8080 \
  -e VITE_NOEMBED_URL='https://noembed.com/embed?url=' \
  -p 8081:80 \
  cvsudeep/watchworthreact
  ```

The frontend will be accessible at http://localhost:8081.

Updating /etc/hosts

To access the frontend using a custom domain name, add the following entry to your /etc/hosts file:

```bash
127.0.0.1 frontend.watchworth.com
You can edit this file using nano or any text editor:
```


## Kubernetes Deployment

Kubernetes Configuration

Ensure you have the following Kubernetes configuration files in the k8s folder:
```bash
frontend-configmap.yaml
frontend-deployment.yaml
frontend-ingress.yaml
frontend-service.yaml
```
Apply the Kubernetes Configuration
Navigate to the k8s folder and apply the configuration to your Kubernetes cluster:

```bash
kubectl apply -f .
```

This will create or update the Kubernetes resources for the frontend application.
Accessing the Frontend

Once deployed, you can access the frontend application using the following URL:


http://frontend.watchworth.com
Ensure that you have configured your Ingress controller and DNS settings correctly for this URL to work .