import axios from 'axios';

const API_URL = 'http://localhost:5500/api/chats';

const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return { Authorization: `Bearer ${token}` };
};

export const getMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};

export const sendMessage = async (chatData) => {
    try {
        const response = await axios.post(`${API_URL}`, chatData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

