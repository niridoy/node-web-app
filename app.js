// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;
const HOST = '0.0.0.0';
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to a strong secret

app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:'); // In-memory database for demo
db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        db.run(
            `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
            [first_name, last_name, email, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'Email already registered' });
                    }
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }
                res.status(201).json({ message: 'User registered successfully', user_id: this.lastID });
            }
        );
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Fetch user from database
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});

// Protected route example
app.get('/api/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: 'Profile data', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Health check
app.get('/api/health-check', (req, res) => {
    res.send('Application running & up!\n');
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
