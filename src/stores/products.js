import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        categories: [],
        loading: false,
        error: null,
    }),

    getters: {
        getCategoryName: (state) => (catId) => {
            const cat = state.categories.find(c => c.id == catId);
            return cat ? cat.name : '-';
        }
    },

    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await apiClient.get('/products');
                this.products = response.data.data || response.data;
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                this.loading = false;
            }
        },

        async fetchCategories() {
            this.loading = true;
            try {
                const response = await apiClient.get('/categories');
                this.categories = response.data.data || response.data;
            } catch (err) {
                console.error("Fetch Error:", err);
                this.error = "Failed to fetch categories.";
            } finally {
                this.loading = false;
            }
        },

        // CREATE (FormData)
        async createProduct(formDataObj) {
            try {
                // Convert Object JS ke FormData
                const formData = new FormData();
                for (const key in formDataObj) {
                    // Skip jika null
                    if (formDataObj[key] !== null) {
                        formData.append(key, formDataObj[key]);
                    }
                }

                await apiClient.post('/admin/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                await this.fetchProducts();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create product";
                return false;
            }
        },

        // UPDATE (FormData dengan spoofing _method: PUT)
        async updateProduct(id, formDataObj) {
            try {
                const formData = new FormData();
                formData.append('_method', 'PUT'); // Spoofing method

                for (const key in formDataObj) {
                    // Kirim gambar hanya jika ada file baru (bukan string URL)
                    if (key === 'image' && typeof formDataObj[key] === 'string') {
                        continue;
                    }
                    if (formDataObj[key] !== null) {
                        formData.append(key, formDataObj[key]);
                    }
                }

                await apiClient.post(`/admin/products/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                await this.fetchProducts();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to update product";
                return false;
            }
        },

        async deleteProduct(id) {
            try {
                await apiClient.delete(`/admin/products/${id}`);
                this.products = this.products.filter(p => p.id !== id);
                return true;
            } catch (err) {
                return false;
            }
        }
    }
});