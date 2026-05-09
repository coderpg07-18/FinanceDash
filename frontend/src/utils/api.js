
// api.js - Centralized API caller

const BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");
const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};


export const authAPI = {

  signup: (body) => fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),

  login: (body) => fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),

  getProfile: () => fetch(`${BASE_URL}/users/profile`, {
      headers: headers(),
    })
    .then(handleResponse),

  getAllUsers: () => fetch(`${BASE_URL}/users`, {
      headers: headers(), 
    })
    .then(handleResponse),
  
  updateProfile: (body) => fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  changePassword: (body) => fetch(`${BASE_URL}/users/change-password`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  forgotPassword: (body) => fetch(`${BASE_URL}/users/forgot-password`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  resetPassword: (token, body) => fetch(`${BASE_URL}/users/reset-password/${token}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  uploadAvatar: (formData) => fetch(`${BASE_URL}/users/avatar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    })
    .then(handleResponse),
};


export const transactionAPI = {

  getAll: ( params = {} ) => {
    
    const q = new URLSearchParams(params).toString();
    
    return fetch(`${BASE_URL}/transactions?${q}`, {
      headers: headers(), 
    })
    .then(
      handleResponse,
    );
  },

  getSummary: ( params = {} ) => {
    
    const q = new URLSearchParams(params).toString();
    
    return fetch(`${BASE_URL}/transactions/summary?${q}`, {
      headers: headers(),
    })
    .then(handleResponse);
  },

  getById: (id) => fetch(`${BASE_URL}/transactions/${id}`, {
    headers: headers(), 
  })
  .then(
    handleResponse,
  ),

  create: (body) => fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),

  update: (id, body) => fetch(`${BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  delete: (id) => fetch(`${BASE_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: headers(),
    })
    .then(handleResponse),
  
  getMonthlyReport: (params = {}) => {

    const q = new URLSearchParams(params).toString();
    
    return fetch(`${BASE_URL}/transactions/reports/monthly?${q}`, {
      headers: headers(),
    })
    .then(handleResponse);
  },
  
  getCategoryReport: (params = {}) => {

    const q = new URLSearchParams(params).toString();
    
    return fetch(`${BASE_URL}/transactions/reports/categories?${q}`, {
      headers: headers(),
    })
    .then(handleResponse);
  },

  exportCSV: (params = {}) => {
  
    const q = new URLSearchParams(params).toString();
  
    return fetch(`${BASE_URL}/transactions/export?${q}`, {
      headers: headers(),
    });
  },
};


export const categoryAPI = {
  
  getAll: () => fetch(`${BASE_URL}/categories`, {
      headers: headers() 
    })
    .then(
      handleResponse,
    ),

  create: (body) => fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  delete: (id) => fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: headers(),
    })
    .then(handleResponse),
};


export const budgetAPI = {
  
  getAll: (params = {}) => {
  
    const q = new URLSearchParams(params).toString();
  
    return fetch(`${BASE_URL}/budgets?${q}`, { 
      headers: headers() 
    })
    .then(
      handleResponse,
    );
  },

  create: (body) => fetch(`${BASE_URL}/budgets`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  update: (id, body) => fetch(`${BASE_URL}/budgets/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    })
    .then(handleResponse),
  
  delete: (id) => fetch(`${BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: headers(),
    })
    .then(handleResponse),
};
