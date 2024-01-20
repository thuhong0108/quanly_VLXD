import axios from 'axios';

const BASE_URL = 'http://localhost:7000/api/product';

export const getAllProducts = async() => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getProductsByCategory = async(categoryId) => {
    try {
        const response = await axios.get(`${BASE_URL}/get/${categoryId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const addProduct = async(data) => {
    const token = JSON.parse(localStorage.getItem('token'));
    try {
        delete data._id;
        const response = await axios.post(`${BASE_URL}/create/${data.categoryId}`, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const editProduct = async(data) => {
    const token = JSON.parse(localStorage.getItem('token'));
    try {
        const response = await axios.put(`${BASE_URL}/edit/${data._id}`, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteProduct = async(id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    try {
        const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const searchProduct = async(value) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/${value}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}