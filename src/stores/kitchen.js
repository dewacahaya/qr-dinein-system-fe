import { defineStore } from "pinia";
import apiClient from "../../lib/axios";
import echo from "../../lib/echo";
import notifSound from '@/assets/undertale-sound-effect-undernet-notification.mp3';

export const useKitchenStore = defineStore('kitchen', {
    state: () => ({
        orders: [],
        loading: false,
        error: null,
        isConnected: false,
        audioContextUnlocked: false,
    }),

    getters: {
        pendingOrders: (state) => (state.orders || []).filter(o =>
            o.status === 'pending' && o.payment_status === 'paid'
        ),
        preparingOrders: (state) => (state.orders || []).filter(o =>
            o.status === 'preparing'
        ),
    },

    actions: {
        async fetchOrders() {
            this.loading = true;
            try {
                const response = await apiClient.get('/orders/kitchen');
                this.orders = response.data.data || [];
                console.log("🔥 FETCHED ORDERS:", this.orders);
            } catch (err) {
                console.error("Fetch Kitchen Orders Error:", err);
                this.orders = [];
            } finally {
                this.loading = false;
            }
        },

        listenForNewOrders() {
            console.log("👂 Kitchen Listening Init...");

            echo.connector.pusher.connection.bind('connected', () => {
                console.log('✅ Connected to Reverb');
                this.isConnected = true;
            });

            echo.connector.pusher.connection.bind('disconnected', () => {
                console.log('❌ Disconnected');
                this.isConnected = false;
            });

            const channel = echo.private('kitchen');

            channel.listen('.order.paid', (e) => {
                console.log("🔔 REALTIME ORDER MASUK:", e);
                this.handleIncomingOrder(e.order, true);
            });

            channel.listen('.order.status.updated', (e) => {
                console.log("♻️ REALTIME STATUS UPDATE:", e);
                this.handleIncomingOrder(e.order, false);
            });
        },

        handleIncomingOrder(newOrder) {
            if (!newOrder || !newOrder.id) return;
            const index = this.orders.findIndex(o => o.id === newOrder.id);
            if (['ready', 'completed', 'cancelled'].includes(newOrder.status)) {
                if (index !== -1) this.orders.splice(index, 1);
                return;
            } if (index !== -1) {
                const existingOrder = this.orders[index];
                const mergedOrder = {
                    ...existingOrder,
                    status: newOrder.status,
                    payment_status: newOrder.payment_status,
                    updated_at: newOrder.updated_at,
                    ui_step: newOrder.ui_step
                };

                if (!mergedOrder.items || mergedOrder.items.length === 0) {
                    mergedOrder.items = newOrder.items;
                }
                this.orders.splice(index, 1, mergedOrder);
            } else {
                if (newOrder.payment_status === 'paid') {
                    this.orders.unshift(newOrder);
                    this.playNotification();
                }
            }
        },

        stopListening() {
            echo.leave('kitchen');
            this.isConnected = false;
        },

        async updateStatus(orderId, newStatus) {
            console.log(`🔄 Updating Order #${orderId} to '${newStatus}'`);

            const index = this.orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                if (newStatus === 'ready') {
                    this.orders.splice(index, 1);
                } else {
                    const updatedOrder = { ...this.orders[index], status: newStatus };
                    this.orders.splice(index, 1, updatedOrder);
                }
            }

            try {
                await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
            } catch (err) {
                console.error("Update failed, reverting...", err);
                await this.fetchOrders();
            }
        },

        playNotification() {
            try {
                const audio = new Audio(notifSound);
                const promise = audio.play();
                if (promise !== undefined) {
                    promise.catch(error => {
                        console.warn("Audio autoplay dicegah browser. User belum interaksi.", error);
                    });
                }
            } catch (e) {
                console.error("Audio Error:", e);
            }
        }
    }
});