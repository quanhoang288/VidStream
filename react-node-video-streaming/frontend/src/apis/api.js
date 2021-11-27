import axios from 'axios';
import { API_BASE_URL } from '../configs';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  responseType: 'json',
  timeout: 300 * 1000,
});

export default axiosClient;
