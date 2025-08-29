import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.4.0.34:4000/api/v1',
});

export default api;