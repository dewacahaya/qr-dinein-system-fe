import { defineStore } from "pinia";
import apiClient from "../../lib/axios";
import echo from "../../lib/echo";

import notifSound from '@/assets/notification_o14egLP.mp3';

export const useCashierStore = defineStore('cashier', {
    state: () => ({
        orders: [],
        loading: false,
        isConnected: false,
    }),

    getters: {
        activeOrders: (state) => {
            return (state.orders || [])
                .filter(o => !['completed', 'cancelled'].includes(o.status))
                .sort((a, b) => {
                    if (a.payment_status === 'unpaid' && b.payment_status !== 'unpaid') return -1;
                    if (a.payment_status !== 'unpaid' && b.payment_status === 'unpaid') return 1;
                    return new Date(b.created_at) - new Date(a.created_at);
                });
        }
    },

    actions: {
        async fetchOrders() {
            this.loading = true;
            try {
                const response = await apiClient.get('/orders/cashier');
                this.orders = response.data.data || [];
            } catch (err) {
                console.error("Fetch Cashier Error:", err);
                this.orders = [];
            } finally {
                this.loading = false;
            }
        },

        listenForNewOrders() {
            console.log("👂 Cashier Listening...");

            echo.connector.pusher.connection.bind('connected', () => {
                console.log('✅ Connected to Reverb');
                this.isConnected = true;
            });

            echo.connector.pusher.connection.bind('disconnected', () => {
                console.log('❌ Disconnected');
                this.isConnected = false;
            });

            const channel = echo.private('cashier');
            channel.listen('.order.paid', (e) => {
                console.log("🔔 NEW ORDER:", e);
                this.handleIncomingOrder(e.order);
                this.playNotification();
            });
            channel.listen('.order.status.updated', (e) => {
                console.log("♻️ STATUS UPDATE:", e);
                this.handleIncomingOrder(e.order);
            });
            channel.listen('.order.paid', (e) => {
                console.log("💰 ORDER PAID:", e);
                this.handleIncomingOrder(e.order);
            });
        },

        handleIncomingOrder(newOrder) {
            if (!newOrder || !newOrder.id) return;
            const index = this.orders.findIndex(o => o.id === newOrder.id);

            if (['completed', 'cancelled'].includes(newOrder.status)) {
                if (index !== -1) this.orders.splice(index, 1);
                return;
            }

            if (index !== -1) {
                this.orders.splice(index, 1, newOrder);
            } else {
                this.orders.unshift(newOrder);
            }
        },

        stopListening() {
            echo.leave('orders');
        },

        async markAsPaid(orderId) {
            try {
                const index = this.orders.findIndex(o => o.id === orderId);
                if (index !== -1) this.orders[index].payment_status = 'paid';

                await apiClient.patch(`/orders/${orderId}/status`, { status: 'pending', payment_status: 'paid' });

            } catch (err) {
                this.fetchOrders();
            }
        },

        async updateStatus(orderId, newStatus) {
            try {
                if (newStatus === 'completed') {
                    const index = this.orders.findIndex(o => o.id === orderId);
                    if (index !== -1) this.orders.splice(index, 1);
                }
                await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
            } catch (err) {
                this.fetchOrders();
            }
        },

        playNotification() {
            try {
                const audio = new Audio(notifSound);
                audio.play().catch(() => { });
            } catch (e) { }
        }
    }
});