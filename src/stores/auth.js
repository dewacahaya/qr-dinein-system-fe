import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';
import router from '@/router/routes';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        isLoggedIn: localStorage.getItem('is_logged_in') === 'true',
    }),

    getters: {
        isAdmin: (state) => state.user?.role === 'admin',
        isCashier: (state) => state.user?.role === 'cashier',
        isKitchen: (state) => state.user?.role === 'kitchen',

        userAvatar: (state) => {
            const seed = state.user?.name || 'User';
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.post('/login', credentials);
                const userData = response.data.data;

                this.user = userData;
                this.isLoggedIn = true;
                localStorage.setItem('is_logged_in', 'true');

                this.redirectByRole();
                return true;

            } catch (err) {
                console.error("Login Error:", err);
                this.error = err.response?.data?.message || "Login gagal.";
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            if (!this.isLoggedIn) return;
            try {
                const response = await apiClient.get('/user');
                this.user = response.data.data;
                this.isLoggedIn = true;
                localStorage.setItem('is_logged_in', 'true');
            } catch (err) {
                this.logout();
            }
        },

        async logout() {
            try {
                await apiClient.post('/logout');
            } catch (e) { }

            this.user = null;
            this.isLoggedIn = false;
            localStorage.removeItem('is_logged_in');
            router.push('/login');
        },

        redirectByRole() {
            const role = this.user?.role;
            if (role === 'admin') router.push('/admin');
            else if (role === 'cashier') router.push('/cashier');
            else if (role === 'kitchen') router.push('/kitchen');
            else router.push('/');
        }
    }
});