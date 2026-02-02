import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial state from localStorage
const getInitialState = () => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
        try {
            const savedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('access_token');
            
            if (savedUser && accessToken) {
                return {
                    isAuthenticated: true,
                    user: JSON.parse(savedUser),
                };
            }
        } catch (error) {
            console.error('Error reading auth state from localStorage:', error);
        }
    }
    
    return {
        isAuthenticated: false,
        user: null,
    };
};

const initialState = getInitialState();

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            // Clear all auth data from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
            }
        },
        // Action to restore auth state on app load
        restoreAuth: (state) => {
            if (typeof window !== 'undefined') {
                try {
                    const savedUser = localStorage.getItem('user');
                    const accessToken = localStorage.getItem('access_token');
                    
                    if (savedUser && accessToken) {
                        state.isAuthenticated = true;
                        state.user = JSON.parse(savedUser);
                    }
                } catch (error) {
                    console.error('Error restoring auth state:', error);
                }
            }
        },
    },
});

export const { login, logout, restoreAuth } = adminSlice.actions;
export default adminSlice.reducer;
