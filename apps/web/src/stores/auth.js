import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
const BASE_URL = '/api';
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(null);
    const loading = ref(false);
    const isAuthenticated = computed(() => token.value !== null);
    const isAdmin = computed(() => user.value?.role === 'admin');
    axios.defaults.headers.common['Authorization'] = token.value ? `Bearer ${token.value}` : '';
    async function login(email, password) {
        loading.value = true;
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            if (data.success && data.data) {
                token.value = data.data.token;
                user.value = data.data.user;
                localStorage.setItem('token', data.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
            }
            return data;
        }
        finally {
            loading.value = false;
        }
    }
    async function register(name, email, password) {
        loading.value = true;
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
            if (data.success && data.data) {
                token.value = data.data.token;
                user.value = data.data.user;
                localStorage.setItem('token', data.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
            }
            return data;
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchMe() {
        if (!token.value)
            return;
        try {
            const { data } = await axios.get(`${BASE_URL}/auth/me`);
            if (data.success) {
                user.value = data.data || null;
            }
        }
        catch {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
        }
    }
    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
    }
    return { token, user, loading, isAuthenticated, isAdmin, login, register, fetchMe, logout };
});
