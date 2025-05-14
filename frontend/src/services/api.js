import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request was made but no response
            console.error('Network Error:', error.request);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Todo API endpoints
export const todoApi = {
    getAllTodos: () => api.get('/todos'),
    createTodo: (todo) => api.post('/todos', todo),
    updateTodo: (id, todo) => api.put(`/todos/${id}`, todo),
    deleteTodo: (id) => api.delete(`/todos/${id}`),
};

// Auth API endpoints
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    validateToken: () => api.get('/auth/validate')
};

export default api; 