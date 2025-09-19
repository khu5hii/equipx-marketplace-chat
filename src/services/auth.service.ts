import axios from 'axios';
import { User } from "@/models/models";

const API_URL = 'http://localhost:5500/api/auth';

export const registerUser = async (userData) : Promise<User> => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data as User;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (credentials) : Promise<User> => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data as User;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
};
