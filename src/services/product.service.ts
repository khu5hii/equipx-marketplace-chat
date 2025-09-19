import { Equipment } from '@/models/models';
import axios from 'axios';

const API_URL = 'http://localhost:5500/api/products';

const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return { Authorization: `Bearer ${token}` };
};

export const fetchProducts = async (): Promise<Equipment[]> => {
    try {
        const response = await axios.get(`${API_URL}`, { headers: getAuthHeader() });
        return response.data as Equipment[];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductsBySeller = async (sellerId: string): Promise<Equipment[]> => {
    try {
        const response = await axios.get(`${API_URL}?sellerId=${sellerId}`, { headers: getAuthHeader() });
        return response.data as Equipment[];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async (productData): Promise<Equipment> => {
    try {
        const response = await axios.post(`${API_URL}`, productData, { headers: getAuthHeader() });
        return response.data as Equipment;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const fetchProductById = async (productId): Promise<Equipment> => {
    try {
        const response = await axios.get(`${API_URL}/${productId}`, { headers: getAuthHeader() });
        return response.data as Equipment;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};
export const updateProduct = async (productId: string, updateData: Partial<Equipment>): Promise<Equipment> => {
    try {
        const response = await axios.put(`${API_URL}/${productId}`, updateData, { headers: getAuthHeader() });
        return response.data as Equipment;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/${productId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};
