import { defineStore } from "pinia";
import apiClient from "../../lib/axios";
import { useCartStore } from "./cart";

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        products: [],
        categories: [],
        table: null,
        loading: false,
        error: null,
    }),

    getters: {
        tableName: (state) => state.table?.table_number || 'Unknown Table',
    },

    actions: {
        async initData(routeQuery) {
            this.loading = true;
            this.error = null;

            try {
                await this.resolveTableLogic(routeQuery);
                await Promise.all([
                    this.fetchCategories(),
                    this.fetchProducts()
                ]);

            } catch (err) {
                console.error("Init Customer Data Failed:", err);
                this.error = "Gagal memuat data restoran.";
            } finally {
                this.loading = false;
            }
        },

        // --- LOGIC TABLE ---
        async resolveTableLogic(query) {
            const cartStore = useCartStore();

            // Skenario A: Scan QR Asli (UUID)
            if (query.uuid) {
                try {
                    const { data } = await apiClient.get(`/tables/resolve/${query.uuid}`);
                    this.table = data;
                    cartStore.setTableId(data.id);
                } catch (e) {
                    console.error("QR Invalid");
                    this.table = { table_number: 'Invalid QR' };
                }
            }
            // Skenario B: Manual/Dev (Table ID)
            else if (query.table_id) {
                this.table = { id: query.table_id, table_number: `Table ${query.table_id}` };
                cartStore.setTableId(query.table_id);
            }
            // Skenario C: Tanpa Meja
            else {
                this.table = { table_number: 'No Table' };
            }
        },

        // --- FETCH DATA ---
        async fetchCategories() {
            try {
                const response = await apiClient.get('/categories');
                this.categories = response.data.data;
            } catch (err) {
                console.error("Fetch Categories Error", err);
            }
        },

        async fetchProducts() {
            try {
                const response = await apiClient.get('/products');
                const allProducts = response.data.data || response.data;

                // --- LOGIC FILTER (Hanya Tampilkan yang Available) ---
                // Kita gunakan '== 1' atau '== true' agar aman menangani angka/boolean dari BE
                this.products = allProducts.filter(product => product.is_available == 1 || product.is_available === true);
            } catch (err) {
                console.error("Fetch Products Error", err);
            }
        }
    }
});