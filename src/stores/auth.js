import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';
import router from '../router/routes';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        isLoggedIn: localStorage.getItem('is_logged_in') === 'true',
        token: localStorage.getItem('auth_token') || null,
    }),

    getters: {
        isAdmin: (state) => state.user?.role === 'admin',
        isCashier: (state) => state.user?.role === 'cashier',
        isKitchen: (state) => state.user?.role === 'kitchen',
        userAvatar: (state) => {
            if (state.user?.avatar) return state.user.avatar;
            const seed = state.user?.name || 'User';
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                try {
                    await apiClient.get('/sanctum/csrf-cookie');
                } catch (e) {
                    console.log("Skipping CSRF (Dev Mode)");
                }

                // 2. Request Login
                await apiClient.post('/login', credentials);

                // 3. Setelah login sukses, kita harus manual fetch user
                // karena endpoint /login Breeze biasanya tidak mengembalikan data user lengkap
                await this.fetchUser();

                // 4. Set Flag Lokal
                this.isLoggedIn = true;
                localStorage.setItem('is_logged_in', 'true');

                // 5. Redirect Logic
                this.redirectByRole();

                return true;
            } catch (err) {
                console.error("Login Failed!:", err);
                if (err.response?.status === 422) {
                    this.error = "Email or Password wrong!";
                } else if (err.response?.status === 419) {
                    this.error = "Session expired, please refresh page.";
                } else {
                    this.error = "Server error.";
                }
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                const response = await apiClient.get('/user');
                this.user = response.data;
                this.isLoggedIn = true;
            } catch (err) {
                // Jika 401 (Unauthenticated), berarti sesi habis
                this.user = null;
                this.isLoggedIn = false;
                localStorage.removeItem('is_logged_in');
            }
        },

        async logout() {
            try {
                await apiClient.post('/logout');
            } catch (err) {
                console.warn("Logout error (session might be expired)", err);
            } finally {
                this.user = null;
                this.isLoggedIn = false;
                localStorage.removeItem('is_logged_in');
                router.push('/login');
            }
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