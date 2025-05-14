const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.redirect('/api');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to Todo API' });
});

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Port configuration - force port 5001
const PORT = 5001;

const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
                process.exit(1);
            } else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 