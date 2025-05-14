import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
} from '@mui/material';
import { authApi } from '../services/api';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = isLogin
                ? await authApi.login(formData)
                : await authApi.register(formData);

            localStorage.setItem('token', response.data.token);
            onAuthSuccess(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Container maxWidth="sm">
            <Paper 
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    background: 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    {isLogin ? 'Login' : 'Register'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        {error && (
                            <Typography color="error" align="center">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Button
                            onClick={() => setIsLogin(!isLogin)}
                            color="secondary"
                            sx={{ mt: 1 }}
                        >
                            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Auth; 