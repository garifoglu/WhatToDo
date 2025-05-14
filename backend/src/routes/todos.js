const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT *, due_date::text as due_date FROM todos ORDER BY created_at DESC'
        );
        
        // Format the dates to ISO string and transform field name
        const formattedTodos = result.rows.map(todo => ({
            ...todo,
            dueDate: todo.due_date ? new Date(todo.due_date).toISOString() : null,
            due_date: undefined // Remove the old field
        }));

        res.json({
            success: true,
            todos: formattedTodos
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch todos',
            todos: []
        });
    }
});

// Create a new todo
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const result = await db.query(
            'INSERT INTO todos (title, description, due_date) VALUES ($1, $2, $3::date) RETURNING *, due_date::text as due_date',
            [title, description, dueDate]
        );

        // Format the date to ISO string and transform field name
        const todo = {
            ...result.rows[0],
            dueDate: result.rows[0].due_date ? new Date(result.rows[0].due_date).toISOString() : null,
            due_date: undefined // Remove the old field
        };

        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            todo
        });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create todo'
        });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, completed } = req.body;
        const result = await db.query(
            `UPDATE todos 
             SET title = $1, 
                 description = $2, 
                 due_date = $3::date, 
                 completed = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             RETURNING *, due_date::text as due_date`,
            [title, description, dueDate, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Format the date to ISO string and transform field name
        const todo = {
            ...result.rows[0],
            dueDate: result.rows[0].due_date ? new Date(result.rows[0].due_date).toISOString() : null,
            due_date: undefined // Remove the old field
        };

        res.json({
            success: true,
            message: 'Todo updated successfully',
            todo
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update todo'
        });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM todos WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            message: 'Todo deleted successfully',
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete todo'
        });
    }
});

module.exports = router; 