const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
    try {
        // Read the schema file
        const schemaSQL = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );

        // Execute the schema
        await pool.query(schemaSQL);
        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase; 