import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';
import router from '@/router/routes';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token') || null,
        loading: false,
        error: null,
        // isLoggedIn: localStorage.getItem('is_logged_in') === 'true',
    }),

    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user,
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

                // Cek struktur response backend
                const responseData = response.data;
                const userData = responseData.data;

                // COBA AMBIL TOKEN DARI BERBAGAI KEMUNGKINAN POSISI
                // Jika Backend sudah diperbaiki temanmu, token akan ada disini
                const token = responseData.access_token || responseData.token;

                if (!token) {
                    console.warn("PERINGATAN: Backend tidak mengembalikan token di JSON. Auth mungkin gagal saat refresh.");
                }

                // Simpan Data
                this.user = userData;
                if (token) {
                    this.token = token;
                    localStorage.setItem('auth_token', token);
                    // Set Header Default untuk request selanjutnya
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                // Tandai logged in
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
            // Jangan fetch jika tidak punya token (kecuali backend pakai cookie session murni)
            if (!this.token && !localStorage.getItem('auth_token')) return;

            try {
                const response = await apiClient.get('/user');
                this.user = response.data.data || response.data;
            } catch (err) {
                // Token expired -> Logout
                this.logout();
            }
        },

        async logout() {
            try {
                await apiClient.post('/logout');
            } catch (e) { /* ignore */ }

            this.user = null;
            this.token = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('is_logged_in');
            delete apiClient.defaults.headers.common['Authorization'];

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