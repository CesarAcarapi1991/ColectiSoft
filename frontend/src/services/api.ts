import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


const api = axios.create({
  baseURL: '/api',  // Ahora usa el proxy de Vite
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor para añadir token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;