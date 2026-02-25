import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },
  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const posts = {
  getAll: async (params) => {
    const { data } = await api.get('/api/posts', { params });
    return data;
  },
  getMyPosts: async (params) => {
    const { data } = await api.get('/api/posts/my', { params });
    return data;
  },
  getOne: async (idOrSlug) => {
    const { data } = await api.get(`/api/posts/${idOrSlug}`);
    return data;
  },
  create: async (postData) => {
    const { data } = await api.post('/api/posts', postData);
    return data;
  },
  update: async (id, postData) => {
    const { data } = await api.put(`/api/posts/${id}`, postData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/api/posts/${id}`);
    return data;
  },
  like: async (id) => {
    const { data } = await api.post(`/api/posts/${id}/like`);
    return data;
  }
};

export const comments = {
  getByPost: async (postId) => {
    const { data } = await api.get(`/api/posts/${postId}/comments`);
    return data;
  },
  create: async (postId, content) => {
    const { data } = await api.post(`/api/posts/${postId}/comments`, { content });
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/api/comments/${id}`);
    return data;
  }
};

export const ai = {
  generate: async (topic, tone, wordCount) => {
    const { data } = await api.post('/api/ai/generate', { topic, tone, wordCount });
    return data;
  },
  summarize: async (content) => {
    const { data } = await api.post('/api/ai/summarize', { content });
    return data;
  },
  reply: async (postContent, comment) => {
    const { data } = await api.post('/api/ai/reply', { postContent, comment });
    return data;
  }
};

export default api;
