const { Pool } = require('pg');
require('dotenv').config();

// Log the connection details (without password)
console.log('Database connection config:', {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_app',
    port: process.env.DB_PORT || 5432
});

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_app',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Test the database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 