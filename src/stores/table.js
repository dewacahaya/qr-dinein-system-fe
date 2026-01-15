import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useTableStore = defineStore('table', {
    state: () => ({
        tables: [],
        loading: false,
        error: null,
        qrCodeBlobUrl: null,
    }),

    actions: {
        // --- FETCH TABLES ---
        async fetchTables() {
            this.loading = true;
            try {
                const response = await apiClient.get('/admin/tables');
                this.tables = response.data.data || response.data;
            } catch (err) {
                console.error("Error fetching tables:", err);
            } finally {
                this.loading = false;
            }
        },

        // --- CREATE TABLE ---
        async createTable(formData) {
            try {
                await apiClient.post('/admin/tables', formData);
                await this.fetchTables();
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create table";
                return false;
            }
        },

        // --- DELETE TABLE ---
        async deleteTable(id) {
            try {
                await apiClient.delete(`/admin/tables/${id}`);
                this.tables = this.tables.filter(t => t.id !== id);
                return true;
            } catch (err) {
                return false;
            }
        },

        // --- GENERATE/DOWNLOAD QR ---
        async generateQr(id) {
            this.loading = true;
            this.qrCodeBlobUrl = null;
            try {
                // Kita request sebagai BLOB (Binary Large Object) karena ini gambar
                const response = await apiClient.get(`/admin/tables/${id}/qr`, {
                    responseType: 'blob'
                });

                // Buat URL lokal dari blob data agar bisa masuk src="" img
                this.qrCodeBlobUrl = window.URL.createObjectURL(new Blob([response.data]));
                return true;
            } catch (err) {
                console.error("Failed to generate QR", err);
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});