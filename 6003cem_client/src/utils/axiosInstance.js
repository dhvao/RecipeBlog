// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://genuineplato-investgenetic-3000.codio-box.uk/api/v1',
  withCredentials: true, // Include credentials (cookies) in requests
});

export default axiosInstance;
