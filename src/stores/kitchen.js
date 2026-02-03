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
        sortOrders() {
            this.orders.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        },

        async fetchOrders() {
            this.loading = true;
            try {
                const response = await apiClient.get('/orders/kitchen');
                this.orders = response.data.data || [];
                this.sortOrders();
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

        handleIncomingOrder(newOrder, isNew = false) {
            if (!newOrder || !newOrder.id) return;

            if (newOrder.table && !newOrder.table_number) {
                newOrder.table_number = newOrder.table.table_number;
            }

            const index = this.orders.findIndex(o => o.id === newOrder.id);
            if (['ready', 'completed', 'cancelled'].includes(newOrder.status)) {
                if (index !== -1) this.orders.splice(index, 1);
                return;
            }
            if (index !== -1) {
                const existingOrder = this.orders[index];

                const itemsToUse = (newOrder.items && newOrder.items.length > 0)
                    ? newOrder.items
                    : existingOrder.items;

                const mergedOrder = {
                    ...existingOrder,
                    ...newOrder,
                    items: itemsToUse,
                    table_number: newOrder.table_number || existingOrder.table_number
                };

                this.orders.splice(index, 1, mergedOrder);
            }
            else if (isNew || newOrder.payment_status === 'paid') {
                this.orders.push(newOrder);
                this.playNotification();
            }
            this.sortOrders();
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
                    const updatedOrder = {
                        ...this.orders[index],
                        status: newStatus,
                        updated_at: new Date().toISOString()
                    };
                    this.orders.splice(index, 1, updatedOrder);
                    this.sortOrders();
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