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

        createFormData(formObj, isUpdate = false) {
            const formData = new FormData();
            if (isUpdate) formData.append('_method', 'PUT');

            for (const key in formObj) {
                const value = formObj[key];

                // Skip avatar handling inside loop to handle it specifically below
                if (key === 'avatar') continue;

                if (value === null || value === undefined) continue;
                formData.append(key, value);
            }

            // Handle Avatar Logic
            if (formObj.avatar instanceof File) {
                // Jika user upload file, kirim file
                formData.append('avatar', formObj.avatar);
            } else if (!isUpdate) {
                // Jika CREATE dan tidak ada file, generate URL random (Dicebear)
                // Agar profile tidak kosong di header/list
                const seed = formObj.username || Math.random().toString(36).substring(7);
                const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                formData.append('avatar', randomAvatar);
            }

            return formData;
        },

        async createUser(formObj) {
            try {
                const formData = this.createFormData(formObj, false);

                await apiClient.post('/admin/users', formData);

                await this.fetchUsers();
                return true;
            } catch (err) {
                // Tampilkan pesan error validasi jika ada
                const msg = err.response?.data?.message || "Failed to create user.";
                console.error("Create User Error:", err.response?.data);
                this.error = msg;
                return false;
            }
        },

        async updateUser(id, formObj) {
            try {
                const formData = this.createFormData(formObj, true);
                await apiClient.post(`/admin/users/${id}`, formData);
                await this.fetchUsers();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed update user";
                return false;
            }
        },

        // async createUser(formDataObj) {
        //     try {
        //         const formData = new FormData();
        //         for (const key in formDataObj) {
        //             if (formDataObj[key] !== null) formData.append(key, formDataObj[key]);
        //         }
        //         await apiClient.post('/admin/users', formData); // Backend harus support multipart
        //         await this.fetchUsers();
        //         return true;
        //     } catch (err) {
        //         this.error = err.response?.data?.message || "Failed create user";
        //         return false;
        //     }
        // },

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