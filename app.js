const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World from Node.js Web App 02!\n');
});

app.get('/about', (req, res) => {
    res.send('About details!\n');
});

app.get('/api/health-check', (req, res) => {
    res.send('Application running & up with argocd!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);