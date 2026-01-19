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
                const rawData = response.data.data || response.data;
                this.categories = rawData.map(cat => ({
                    label: cat.name,
                    value: cat.id,
                    id: cat.id,
                    name: cat.name
                }));

                console.log("Categories Loaded:", this.categories);
            } catch (err) {
                console.error("Fetch Error:", err);
                this.error = "Failed to fetch categories.";
            } finally {
                this.loading = false;
            }
        },

        // createFormData(formDataObj, isUpdate = false) {
        //     const formData = new FormData();

        //     if (isUpdate) {
        //         formData.append('_method', 'PUT');
        //     }

        //     for (const key in formDataObj) {
        //         const value = formDataObj[key];

        //         // Skip jika null/undefined
        //         if (value === null || value === undefined) continue;

        //         // FIX IS_AVAILABLE: Konversi Explicit ke '1' atau '0'
        //         if (key === 'is_available') {
        //             formData.append(key, value ? '1' : '0');
        //             continue;
        //         }

        //         // Handle Image
        //         if (key === 'image') {
        //             if (value instanceof File) {
        //                 formData.append(key, value);
        //             }
        //             continue;
        //         }

        //         // Default
        //         formData.append(key, value);
        //     }
        //     return formData;
        // },

        // async createProduct(formDataObj) {
        //     try {
        //         const formData = this.createFormData(formDataObj, false);
        //         await apiClient.post('/admin/products', formData, {
        //             headers: { 'Content-Type': 'multipart/form-data' }
        //         });
        //         await this.fetchProducts();
        //         return true;
        //     } catch (err) {
        //         this.error = err.response?.data?.message || "Create Failed";
        //         console.error("Create Error:", err.response?.data);
        //         return false;
        //     }
        // },

        // async updateProduct(id, formDataObj) {
        //     try {
        //         const formData = this.createFormData(formDataObj, true);
        //         await apiClient.post(`/admin/products/${id}`, formData, {
        //             headers: { 'Content-Type': 'multipart/form-data' }
        //         });
        //         await this.fetchProducts();
        //         return true;
        //     } catch (err) {
        //         this.error = err.response?.data?.message || "Update Failed";
        //         console.error("Update Error:", err.response?.data);
        //         return false;
        //     }
        // },

        async createProduct(formDataObj) {
            try {
                // Convert Object JS ke FormData
                const formData = new FormData();
                for (const key in formDataObj) {
                    if (formDataObj[key] !== null) {
                        const value = typeof formDataObj[key] === 'boolean' ? (formDataObj[key] ? 1 : 0) : formDataObj[key];
                        formData.append(key, value);
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

        async updateProduct(id, formDataObj) {
            try {
                const formData = new FormData();
                formData.append('_method', 'PUT');

                for (const key in formDataObj) {
                    if (key === 'image' && typeof formDataObj[key] === 'string') continue;
                    if (formDataObj[key] !== null) {
                        const value = typeof formDataObj[key] === 'boolean' ? (formDataObj[key] ? 1 : 0) : formDataObj[key];
                        formData.append(key, value);
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