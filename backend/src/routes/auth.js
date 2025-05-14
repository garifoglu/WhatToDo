const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Generate token
        const token = jwt.sign(
            { userId: result.rows[0].id },
            'your-secret-key',  // In production, use environment variable
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.rows[0].id, email: result.rows[0].email },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            'your-secret-key',  // In production, use environment variable
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Validate token and get user info
router.get('/validate', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT id, email FROM users WHERE id = $1', [req.userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Token is valid',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router; 