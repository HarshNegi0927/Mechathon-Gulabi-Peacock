// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/budget'; // Adjust this to match your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Budget API calls
export const budgetAPI = {
  createBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },
  getBudgets: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },
  updateBudget: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  }
};

// Expense API calls
export const expenseAPI = {
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/expenses?${params}`);
    return response.data;
  }
};

// Dashboard/Report API calls
export const reportAPI = {
  getDashboardData: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  }
};

// Error handling middleware
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// budgetApi.js

// Get all budgets for the current user
export const getBudgets = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
       console.log(error)
        console.error('Error fetching budgets:', error);
        throw error;
    }
};

// Create a new budget
export const createBudget = async (budgetData) => {
    try {
        const response = await axios.post(API_BASE_URL, budgetData);
        return response.data;
    } catch (error) {
        console.error('Error creating budget:', error);
        throw error;
    }
};

// Update an existing budget
export const updateBudget = async (budgetId, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${budgetId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating budget:', error);
        throw error;
    }
};

// Delete a budget
export const deleteBudget = async (budgetId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${budgetId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting budget:', error);
        throw error;
    }
};

// Archive a budget
export const archiveBudget = async (budgetId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${budgetId}/archive`);
        return response.data;
    } catch (error) {
        console.error('Error archiving budget:', error);
        throw error;
    }
};
