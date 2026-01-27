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
            const finalTableId = this.tableId || 1;

            const formattedItems = this.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                notes: item.notes,
                price: item.price
            }));

            const payload = {
                table_id: finalTableId,
                customer_name: this.customerName || 'Guest',
                total_amount: this.totalPrice,
                items: formattedItems
            };

            try {
                console.log("📤 Sending Payload:", payload);
                const response = await apiClient.post('/orders', payload);
                const data = response.data.data || response.data;
                return data;

            } catch (error) {
                if (error.response?.status === 422) {
                    console.error("❌ Validation Error:", error.response.data.errors);
                    alert("Gagal Checkout: " + JSON.stringify(error.response.data.errors));
                } else {
                    console.error("❌ Checkout Failed:", error);
                    alert("Terjadi kesalahan sistem.");
                }
                throw error;
            }
        }
    },

    persist: true,
});