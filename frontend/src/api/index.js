import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // L-URL d l-backend dyalk
});

// Hada hwa l-sir bach l-backend i-3refk chkun nti (Token)
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;