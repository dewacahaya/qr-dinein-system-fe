import { defineStore } from 'pinia';
import apiClient from '../../lib/axios';

export const useCartStore = defineStore('cart', {
    state: () => ({
        tableId: null,
        customerName: '',
        items: [],
    }),

    getters: {
        totalPrice: (state) => {
            return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        // Menghitung Total Item
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0);
        }
    },

    actions: {
        setTableId(id) {
            this.tableId = id;
        },

        addToCart(product, quantity = 1, notes = '') {
            const existingItem = this.items.find(item =>
                item.id === product.id && item.notes === notes
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    cartId: Date.now() + Math.random(),
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    notes: notes
                });
            }
        },

        removeFromCart(cartId) {
            this.items = this.items.filter(item => item.cartId !== cartId);
        },

        clearCart() {
            this.items = [];
            this.customerName = '';
        },

        async checkout() {
            if (!this.tableId) {
                this.tableId = 1;
            }

            const payload = {
                table_id: this.tableId,
                customer_name: this.customerName,
                items: this.items.map(item => ({
                    product_id: item.id,
                    qty: item.quantity,
                    note: item.notes
                }))
            };

            try {
                console.log("Sending Checkout:", payload);
                const response = await apiClient.post('/orders', payload);
                return response.data;

            } catch (error) {
                console.error("Checkout Gagal:", error);
                throw error;
            }
        }
    },

    persist: true,
});