import React, { useState, useEffect } from 'react';
import { todoApi } from './services/api';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    TextField, 
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ThemeProvider,
    createTheme,
    CssBaseline,
    ButtonGroup
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Auth from './components/Auth';
import { authApi } from './services/api';

// Create a dark theme with blue accents
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2196f3', // Blue
        },
        secondary: {
            main: '#90caf9', // Light Blue
        },
        background: {
            default: '#0a1929', // Dark Blue-Black
            paper: '#1a2027', // Slightly lighter dark blue
        },
        text: {
            primary: '#ffffff',
            secondary: '#90caf9',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

function App() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('all');
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDate: ''
    });
    const [editingTodo, setEditingTodo] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [fontSize, setFontSize] = useState(1); // Base font size multiplier

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token and get user info
            const validateToken = async () => {
                try {
                    const response = await authApi.validateToken();
                    setUser(response.data.user);
                    loadTodos();
                } catch (err) {
                    console.error('Token validation error:', err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            };
            validateToken();
        } else {
            setLoading(false);
        }
    }, []);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        loadTodos();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setTodos([]);
    };

    const loadTodos = async () => {
        try {
            setLoading(true);
            const response = await todoApi.getAllTodos();
            setTodos(response.data.todos || []);
        } catch (err) {
            setError(err.message || 'Failed to load todos');
            console.error('Error loading todos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTodo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingTodo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            // Format the date to match the backend's expected format
            const formattedTodo = {
                ...newTodo,
                dueDate: newTodo.dueDate ? new Date(newTodo.dueDate).toISOString().split('T')[0] : null
            };
            const response = await todoApi.createTodo(formattedTodo);
            setTodos(prev => [...prev, response.data.todo]);
            setNewTodo({ title: '', description: '', dueDate: '' }); // Reset form
        } catch (err) {
            setError(err.message || 'Failed to create todo');
            console.error('Error creating todo:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoApi.deleteTodo(id);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete todo');
            console.error('Error deleting todo:', err);
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            const todo = todos.find(t => t.id === id);
            const updatedTodo = { ...todo, completed: !todo.completed };
            await todoApi.updateTodo(id, updatedTodo);
            setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
        } catch (err) {
            setError(err.message || 'Failed to update todo');
            console.error('Error updating todo:', err);
        }
    };

    const handleEditClick = (todo) => {
        setEditingTodo(todo);
        setIsEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            // Format the date to match the backend's expected format
            const formattedTodo = {
                ...editingTodo,
                dueDate: editingTodo.dueDate ? new Date(editingTodo.dueDate).toISOString().split('T')[0] : null
            };
            const response = await todoApi.updateTodo(editingTodo.id, formattedTodo);
            setTodos(prev => prev.map(t => t.id === editingTodo.id ? response.data.todo : t));
            setIsEditDialogOpen(false);
            setEditingTodo(null);
        } catch (err) {
            setError(err.message || 'Failed to update todo');
            console.error('Error updating todo:', err);
        }
    };

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 0.1, 1.5));
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 0.1, 0.8));
    };

    const calculateTimeRemaining = (dueDate) => {
        if (!dueDate) return null;
        
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;
        
        if (diffTime < 0) return 'Overdue!';
        
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} left`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} left`;
        } else {
            return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
        }
    };

    const getDeadlineColor = (dueDate) => {
        if (!dueDate) return 'text.secondary';
        
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due - now;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffTime < 0) return 'error.main';
        if (diffDays <= 1) return '#ff9800'; // Orange for urgent
        if (diffDays <= 3) return '#ffd700'; // Yellow for warning
        return 'success.main';
    };

    // Add filtered todos computation
    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        return true; // 'all' filter
    });

    const activeTodos = filteredTodos.filter(todo => !todo.completed);
    const completedTodos = filteredTodos.filter(todo => todo.completed);

    if (!user) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Auth onAuthSuccess={handleAuthSuccess} />
            </ThemeProvider>
        );
    }

    if (loading) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box 
                sx={{ 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 4,
                    py: 2
                }}
            >
                <Container 
                    maxWidth="lg" 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }}
                >
                    {/* Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <Typography 
                            variant="h4" 
                            component="h1"
                            sx={{ 
                                color: 'primary.main',
                                fontWeight: 600,
                                fontSize: `${2.125 * fontSize}rem`
                            }}
                        >
                            WhatTodo
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <ButtonGroup variant="contained" size="small">
                                <Button
                                    onClick={() => setFilter('all')}
                                    color={filter === 'all' ? 'primary' : 'inherit'}
                                >
                                    All
                                </Button>
                                <Button
                                    onClick={() => setFilter('active')}
                                    color={filter === 'active' ? 'primary' : 'inherit'}
                                >
                                    Active
                                </Button>
                                <Button
                                    onClick={() => setFilter('completed')}
                                    color={filter === 'completed' ? 'primary' : 'inherit'}
                                >
                                    Completed
                                </Button>
                            </ButtonGroup>
                            <Box>
                                <IconButton onClick={decreaseFontSize} size="small">
                                    <TextDecreaseIcon />
                                </IconButton>
                                <IconButton onClick={increaseFontSize} size="small">
                                    <TextIncreaseIcon />
                                </IconButton>
                            </Box>
                            <Button 
                                onClick={handleLogout}
                                variant="outlined"
                                color="primary"
                                size="small"
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 3,
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        {/* Left Column - Todo Creation */}
                        <Box sx={{ width: '25%', minWidth: '250px' }}>
                            {/* Create Todo Form */}
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 3,
                                    background: 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            name="title"
                                            label="Todo Title"
                                            value={newTodo.title}
                                            onChange={handleInputChange}
                                            required
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <TextField
                                            name="description"
                                            label="Description"
                                            value={newTodo.description}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={2}
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <TextField
                                            name="dueDate"
                                            label="Due Date"
                                            type="date"
                                            value={newTodo.dueDate}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            variant="outlined"
                                            inputProps={{
                                                min: new Date().toISOString().split('T')[0]
                                            }}
                                        />
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="primary"
                                            disabled={!newTodo.title.trim()}
                                            sx={{ 
                                                py: 1.5,
                                                fontSize: '1rem',
                                                boxShadow: '0 4px 6px rgba(33, 150, 243, 0.2)'
                                            }}
                                        >
                                            Add Todo
                                        </Button>
                                    </Box>
                                </form>
                            </Paper>
                        </Box>

                        {/* Center Column - Active Todos */}
                        <Box sx={{ width: '35%', minWidth: '350px' }}>
                            {error && (
                                <Typography 
                                    color="error" 
                                    gutterBottom
                                    sx={{ 
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                        p: 2,
                                        borderRadius: 2,
                                        mb: 2
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Paper 
                                elevation={3}
                                sx={{ 
                                    background: 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    Active Todos
                                </Typography>
                                <List>
                                    {activeTodos.length === 0 ? (
                                        <ListItem>
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography
                                                        component="div"
                                                        variant="body1"
                                                        sx={{
                                                            textAlign: 'center',
                                                            color: 'text.secondary',
                                                            fontSize: `${fontSize}rem`
                                                        }}
                                                    >
                                                        No active todos
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ) : (
                                        activeTodos.map((todo) => (
                                            <ListItem
                                                key={todo.id || Math.random()}
                                                sx={{
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                    '&:last-child': {
                                                        borderBottom: 'none'
                                                    },
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                                    },
                                                    padding: 2
                                                }}
                                            >
                                                <IconButton
                                                    edge="start"
                                                    onClick={() => handleToggleComplete(todo.id)}
                                                    sx={{ mr: 2 }}
                                                >
                                                    {todo.completed ?
                                                        <CheckCircleIcon color="success" /> :
                                                        <RadioButtonUncheckedIcon sx={{ color: 'text.secondary' }} />
                                                    }
                                                </IconButton>
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            sx={{
                                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                                color: todo.completed ? 'text.secondary' : 'text.primary',
                                                                fontSize: `${fontSize}rem`
                                                            }}
                                                        >
                                                            {todo.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box component="div" sx={{ mt: 1 }}>
                                                            {todo.description && (
                                                                <Typography
                                                                    component="div"
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'text.secondary',
                                                                        fontSize: `${0.875 * fontSize}rem`,
                                                                        mb: 1
                                                                    }}
                                                                >
                                                                    {todo.description}
                                                                </Typography>
                                                            )}
                                                            {todo.dueDate && (
                                                                <Box
                                                                    component="div"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                                        borderRadius: 1,
                                                                        padding: 1
                                                                    }}
                                                                >
                                                                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <AccessTimeIcon sx={{ color: getDeadlineColor(todo.dueDate) }} />
                                                                        <Typography
                                                                            component="div"
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: getDeadlineColor(todo.dueDate),
                                                                                fontWeight: 'medium',
                                                                                fontSize: `${0.9 * fontSize}rem`
                                                                            }}
                                                                        >
                                                                            {new Date(todo.dueDate).toLocaleDateString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <NotificationsActiveIcon sx={{
                                                                            color: getDeadlineColor(todo.dueDate),
                                                                            animation: getDeadlineColor(todo.dueDate) === '#ff9800' ? 'pulse 1s infinite' : 'none'
                                                                        }} />
                                                                        <Typography
                                                                            component="div"
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: getDeadlineColor(todo.dueDate),
                                                                                fontWeight: 'bold',
                                                                                fontSize: `${0.9 * fontSize}rem`
                                                                            }}
                                                                        >
                                                                            {calculateTimeRemaining(todo.dueDate)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Box component="div">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleEditClick(todo)}
                                                        sx={{ mr: 1, color: 'primary.light' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleDelete(todo.id)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </Paper>
                        </Box>

                        {/* Right Column - Completed Todos */}
                        <Box sx={{ width: '25%', minWidth: '250px' }}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    background: 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    Completed Todos
                                </Typography>
                                <List>
                                    {completedTodos.length === 0 ? (
                                        <ListItem>
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography
                                                        component="div"
                                                        variant="body1"
                                                        sx={{
                                                            textAlign: 'center',
                                                            color: 'text.secondary',
                                                            fontSize: `${fontSize}rem`
                                                        }}
                                                    >
                                                        No completed todos
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ) : (
                                        completedTodos.map((todo) => (
                                            <ListItem
                                                key={todo.id || Math.random()}
                                                sx={{
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                    '&:last-child': {
                                                        borderBottom: 'none'
                                                    },
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                                                    },
                                                    padding: 2
                                                }}
                                            >
                                                <IconButton
                                                    edge="start"
                                                    onClick={() => handleToggleComplete(todo.id)}
                                                    sx={{ mr: 2 }}
                                                >
                                                    {todo.completed ?
                                                        <CheckCircleIcon color="success" /> :
                                                        <RadioButtonUncheckedIcon sx={{ color: 'text.secondary' }} />
                                                    }
                                                </IconButton>
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            sx={{
                                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                                color: todo.completed ? 'text.secondary' : 'text.primary',
                                                                fontSize: `${fontSize}rem`
                                                            }}
                                                        >
                                                            {todo.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box component="div" sx={{ mt: 1 }}>
                                                            {todo.description && (
                                                                <Typography
                                                                    component="div"
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'text.secondary',
                                                                        fontSize: `${0.875 * fontSize}rem`,
                                                                        mb: 1
                                                                    }}
                                                                >
                                                                    {todo.description}
                                                                </Typography>
                                                            )}
                                                            {todo.dueDate && (
                                                                <Box
                                                                    component="div"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                                        borderRadius: 1,
                                                                        padding: 1
                                                                    }}
                                                                >
                                                                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <AccessTimeIcon sx={{ color: getDeadlineColor(todo.dueDate) }} />
                                                                        <Typography
                                                                            component="div"
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: getDeadlineColor(todo.dueDate),
                                                                                fontWeight: 'medium',
                                                                                fontSize: `${0.9 * fontSize}rem`
                                                                            }}
                                                                        >
                                                                            {new Date(todo.dueDate).toLocaleDateString('en-US', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <NotificationsActiveIcon sx={{
                                                                            color: getDeadlineColor(todo.dueDate),
                                                                            animation: getDeadlineColor(todo.dueDate) === '#ff9800' ? 'pulse 1s infinite' : 'none'
                                                                        }} />
                                                                        <Typography
                                                                            component="div"
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: getDeadlineColor(todo.dueDate),
                                                                                fontWeight: 'bold',
                                                                                fontSize: `${0.9 * fontSize}rem`
                                                                            }}
                                                                        >
                                                                            {calculateTimeRemaining(todo.dueDate)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Box component="div">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleEditClick(todo)}
                                                        sx={{ mr: 1, color: 'primary.light' }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleDelete(todo.id)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </Paper>
                        </Box>
                    </Box>

                    {/* Edit Dialog */}
                    <Dialog 
                        open={isEditDialogOpen} 
                        onClose={() => setIsEditDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                background: 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: 'primary.main' }}>Edit Todo</DialogTitle>
                        <DialogContent>
                            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    name="title"
                                    label="Todo Title"
                                    value={editingTodo?.title || ''}
                                    onChange={handleEditInputChange}
                                    required
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    name="description"
                                    label="Description"
                                    value={editingTodo?.description || ''}
                                    onChange={handleEditInputChange}
                                    multiline
                                    rows={2}
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    name="dueDate"
                                    label="Due Date"
                                    type="date"
                                    value={editingTodo?.dueDate || ''}
                                    onChange={handleEditInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button 
                                onClick={() => setIsEditDialogOpen(false)}
                                variant="outlined"
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleEditSave} 
                                variant="contained" 
                                color="primary"
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App; 