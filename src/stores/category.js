import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchCategories() {
            this.loading = true;
            try {
                const response = await apiClient.get('/categories');
                console.log("Response: ", response.data)
                let data = response.data.data || response.data;
                this.categories = data.sort((a, b) => a.id - b.id);
            } catch (err) {
                console.error("Fetch Error:", err);
                this.error = "Failed to fetch categories.";
            } finally {
                this.loading = false;
            }
        },

        async createCategory(form) {
            try {
                await apiClient.post('/admin/categories', form);
                await this.fetchCategories();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create category.";
                return false;
            }
        },

        async updateCategory(id, form) {
            try {
                await apiClient.put(`/admin/categories/${id}`, form);
                await this.fetchCategories();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to update category.";
                return false;
            }
        },

        async deleteCategory(id) {
            try {
                await apiClient.delete(`/admin/categories/${id}`);
                this.categories = this.categories.filter(c => c.id !== id);
                return true;
            } catch (err) {
                if (err.response?.status === 500 || err.response?.data?.message?.includes('Constraint')) {
                    alert("Gagal menghapus! Kategori ini masih memiliki produk. Hapus produknya terlebih dahulu.");
                } else {
                    this.error = "Gagal menghapus kategori.";
                    alert(this.error);
                }
                return false;
            }
        }
    }
});