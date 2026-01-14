import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';
import router from '@/router/routes';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        // Gunakan flag localStorage hanya untuk UI state
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
                // 1. Langsung request Login (Tanpa CSRF Cookie sebelumnya)
                // Credentials harus { email: '...', password: '...' }
                const response = await apiClient.post('/login', credentials);

                // 2. Ambil data user dari response backend
                // Struktur AuthController kamu: { message: "...", data: { ...user... } }
                const userData = response.data.data;

                // 3. Update State
                this.user = userData;
                this.isLoggedIn = true;
                localStorage.setItem('is_logged_in', 'true');

                // 4. Redirect sesuai Role
                this.redirectByRole();

                return true;

            } catch (err) {
                console.error("Login Gagal:", err);

                // Handling Error 422 (Validasi)
                if (err.response?.status === 422) {
                    // Ambil pesan error detail dari Laravel
                    const validationErrors = err.response.data.errors;
                    if (validationErrors) {
                        // Ambil error pertama (misal: "email is required")
                        this.error = Object.values(validationErrors).flat()[0];
                    } else {
                        this.error = err.response.data.message || "Data login tidak valid.";
                    }
                } else if (err.response?.status === 401) {
                    this.error = "Email atau password salah.";
                } else {
                    this.error = "Gagal terhubung ke server.";
                }
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                // Endpoint AuthController: GET /user
                const response = await apiClient.get('/user');
                // Struktur: { data: { ...user... } }
                this.user = response.data.data;
                this.isLoggedIn = true;
            } catch (err) {
                // Jika 401, berarti cookie expired/invalid
                this.user = null;
                this.isLoggedIn = false;
                localStorage.removeItem('is_logged_in');
            }
        },

        async logout() {
            try {
                await apiClient.post('/logout');
            } catch (e) { /* ignore */ }

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
            else router.push('/admin'); // Default fallback
        }
    }
});