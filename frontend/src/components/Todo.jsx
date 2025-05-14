import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeadlineDisplay from './DeadlineDisplay';

const Todo = ({ todo, onDelete, onEdit, onToggleComplete }) => {
    const isUrgent = todo.dueDate && new Date(todo.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

    return (
        <Card 
            sx={{ 
                mb: 2,
                backgroundColor: todo.completed ? 'action.selected' : 'background.paper',
                position: 'relative',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => onToggleComplete(todo.id)}
                            color="primary"
                        />
                        <Box sx={{ ml: 1 }}>
                            <Typography 
                                variant="h6" 
                                component="div"
                                sx={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? 'text.secondary' : 'text.primary'
                                }}
                            >
                                {todo.title}
                            </Typography>
                            {todo.description && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                        textDecoration: todo.completed ? 'line-through' : 'none'
                                    }}
                                >
                                    {todo.description}
                                </Typography>
                            )}
                            {todo.dueDate && (
                                <DeadlineDisplay dueDate={todo.dueDate} />
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isUrgent && !todo.completed && (
                            <IconButton size="small" color="warning">
                                <NotificationsActiveIcon />
                            </IconButton>
                        )}
                        <IconButton size="small" onClick={() => onEdit(todo)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(todo.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Todo; 