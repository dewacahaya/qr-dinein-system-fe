import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        loading: false,
        error: null,
    }),

    actions: {
        // --- FETCH USERS ---
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await apiClient.get('/api/admin/user');
                this.users = response.data.data || response.data;
            } catch (err) {
                console.error("Error fetching users:", err);
                this.error = "Failed to load users.";
            } finally {
                this.loading = false;
            }
        },

        // --- CREATE USER ---
        async createUser(formData) {
            try {
                await apiClient.post('/api/admin/users', formData);

                // Simulation: Update local state because Mock API is stateless
                this.users.push({
                    id: Date.now(),
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
                });
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create user.";
                return false;
            }
        },

        // --- DELETE USER ---
        async deleteUser(id) {
            try {
                await apiClient.delete(`/api/admin/users/${id}`);
                // Update local state
                this.users = this.users.filter(u => u.id !== id);
                return true;
            } catch (err) {
                this.error = "Failed to delete user.";
                return false;
            }
        }
    }
});