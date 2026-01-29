import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useTableStore = defineStore('table', {
    state: () => ({
        tables: [],
        loading: false,
        error: null,
        qrCodeSvg: null,
        qrCodeBlobUrl: null,
    }),

    actions: {
        async fetchTables() {
            this.loading = true;
            try {
                const response = await apiClient.get('/admin/tables');
                this.tables = response.data.data || response.data;
                this.tables.sort((a, b) => a.id - b.id);
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

        async deleteTable(id) {
            try {
                await apiClient.delete(`/admin/tables/${id}`);
                this.tables = this.tables.filter(t => t.id !== id);
                return true;
            } catch (err) {
                return false;
            }
        },

        async generateQr(id) {
            this.loading = true;
            this.qrCodeSvg = null;
            this.qrCodeBlobUrl = null;

            try {
                const response = await apiClient.get(`/admin/tables/${id}/qr`);
                const svgString = response.data.svg;

                if (!svgString) throw new Error("SVG not found in response");
                this.qrCodeSvg = svgString;

                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                this.qrCodeBlobUrl = window.URL.createObjectURL(blob);

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