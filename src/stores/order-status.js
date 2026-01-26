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

        listenToOrder(orderId) {
            echo.channel(`orders.${orderId}`)
                .listen('.order.status.updated', (e) => {
                    console.log("Realtime Update:", e);
                    if (this.order) {
                        this.order.status = e.order.status;
                        this.order.ui_step = e.order.ui_step;
                        this.order.ui_description = e.order.ui_description;
                        this.fetchOrder(orderId);
                    }
                });
        },

        stopListening(orderId) {
            if (orderId) {
                echo.leave(`orders.${orderId}`);
            }
        }
    }
});