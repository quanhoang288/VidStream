require('dotenv').config();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const ASSET_BASE_URL = process.env.REACT_APP_ASSET_BASE_URL;

export { API_BASE_URL, ASSET_BASE_URL, SOCKET_URL };
