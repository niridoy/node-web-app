# Node Web App

A simple Node.js web application with automated CI/CD using GitHub Actions and ArgoCD.

## Development Workflow

1. Create a new branch from `main`
2. Make your changes
3. Create a Pull Request to the `deployment` branch
4. After review and merge:
   - GitHub Actions will automatically:
     - Build the Docker image
     - Push to GitHub Container Registry
     - Update Kubernetes manifests
   - ArgoCD will automatically:
     - Detect the changes
     - Deploy to Kubernetes cluster

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml      # CI/CD pipeline configuration
├── kubernetes/
│   ├── deployment.yaml    # Kubernetes deployment and service
│   └── application.yaml   # ArgoCD application manifest
├── app.js                 # Node.js application
├── Dockerfile            # Docker build configuration
├── package.json         # Node.js dependencies
└── README.md           # This file
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
npm start
```

## Manual Deployment

While CI/CD is set up, you can still deploy manually:

1. Build the image:
```bash
docker build -t ghcr.io/niridoy/node-web-app:latest .
```

2. Push to GitHub Container Registry:
```bash
docker push ghcr.io/niridoy/node-web-app:latest
```

3. Apply Kubernetes manifests:
```bash
kubectl apply -f kubernetes/
```

## CI/CD Pipeline

The CI/CD pipeline is triggered when:
- A PR is created targeting the `deployment` branch
- Changes are merged into the `deployment` branch

The pipeline:
1. Builds the Docker image
2. Pushes to GitHub Container Registry
3. Updates Kubernetes manifests with new image tag
4. ArgoCD detects the changes and syncs automatically

## Security

- The `deployment` branch is protected
- Pull request reviews are required
- GitHub Actions uses GITHUB_TOKEN for authentication
- Images are scanned for vulnerabilities