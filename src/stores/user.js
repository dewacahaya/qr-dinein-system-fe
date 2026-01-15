import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await apiClient.get('/admin/users');
                this.users = response.data.data || response.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async createUser(formDataObj) {
            try {
                const formData = new FormData();
                for (const key in formDataObj) {
                    if (formDataObj[key] !== null) formData.append(key, formDataObj[key]);
                }
                await apiClient.post('/admin/users', formData); // Backend harus support multipart
                await this.fetchUsers();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed create user";
                return false;
            }
        },

        // ... Implement update & delete similar to product ...
        async deleteUser(id) {
            try {
                await apiClient.delete(`/admin/users/${id}`);
                this.users = this.users.filter(u => u.id !== id);
                return true;
            } catch (e) { return false; }
        }
    }
});