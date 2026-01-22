import { defineStore } from "pinia";
import apiClient from "../../lib/axios";
import echo from "../../lib/echo";

export const useOrderStatusStore = defineStore("order-status", {
    state: () => ({
        order: null,
        loading: false,
        error: null,
    }),
    actions: {
        // 1. Fetch Data Awal (HTTP)
        async fetchOrder(orderId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.get(`/orders/${orderId}/track`);
                this.order = response.data.data;
            } catch (err) {
                console.error("Track Order Failed:", err);
                this.error = "Pesanan tidak ditemukan.";
            } finally {
                this.loading = false;
            }
        },

        // 2. Listen Realtime (WebSocket)
        listenToOrder(orderId) {
            // Asumsi backend broadcast ke channel: "orders.{id}"
            // Event name: "OrderStatusUpdated" (Sesuaikan dengan Event Class di Laravel)
            echo.channel(`orders.${orderId}`)
                .listen('OrderStatusUpdated', (e) => {
                    console.log("Realtime Update:", e);

                    // Update state lokal tanpa refresh
                    // Asumsi payload e berisi order terbaru atau status baru
                    if (this.order) {
                        // Update field yang relevan saja agar smooth
                        this.order.status = e.order.status;
                        this.order.ui_step = e.order.ui_step; // Backend perlu kirim logic UI step juga di event
                        this.order.ui_description = e.order.ui_description;

                        // Atau fetch ulang biar aman sync datanya
                        this.fetchOrder(orderId);
                    }
                });
        },

        // 3. Cleanup Listener
        stopListening(orderId) {
            if (orderId) {
                echo.leave(`orders.${orderId}`);
            }
        }
    }
});