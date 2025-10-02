const exapp.get('/', (req, res) => {
    res.send('Welcome to our Node.js Application - Deployed with ArgoCD and GitHub Actions!\n'); ess = require('express');

    // Constants
    const PORT = 8080;
    const HOST = '0.0.0.0';

    // App
    const app = express();
    app.get('/', (req, res) => {
        res.send('Hello World from Node.js Web App!\n');
    });

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);