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
            const cat = state.categories.find(c => c.id === catId);
            return cat ? cat.name : '-';
        }
    },

    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await apiClient.get('/api/products');
                this.products = response.data.data;
            } catch (err) {
                this.error = "Failed to fetch products";
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async fetchCategories() {
            try {
                const response = await apiClient.get('/api/categories');
                this.categories = response.data.data.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    label: cat.name,
                    value: cat.id
                }));
            } catch (err) {
                console.error(err);
            }
        },

        // --- CRUD ACTIONS ---
        async createProduct(formData) {
            try {
                // Karena ada upload file, biasanya pakai FormData
                // Tapi Mock API kita terima JSON biasa, jadi kita sesuaikan dulu
                // Nanti di Real API pakai: const data = new FormData(); ...

                const payload = {
                    ...formData,
                    is_available: true 
                };

                await apiClient.post('/api/admin/products', payload);
                this.products.push({
                    id: Date.now(),
                    ...payload,
                    image: payload.image || 'https://placehold.co/300'
                });

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create product";
                return false;
            }
        },

        async updateProduct(id, formData) {
            try {
                // await apiClient.put(`/admin/products/${id}`, formData);

                // Simulasi Update Lokal
                const index = this.products.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...formData };
                }
                return true;
            } catch (err) {
                return false;
            }
        },

        async deleteProduct(id) {
            try {
                await apiClient.delete(`/api/admin/products/${id}`);
                this.products = this.products.filter(p => p.id !== id);
                return true;
            } catch (err) {
                return false;
            }
        }
    }
});