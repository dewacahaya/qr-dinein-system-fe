<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '../../../lib/utils';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';

defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'confirm-payment']);

const cartStore = useCartStore();
const customerName = ref('');

const handlePayment = () => {
    if (!customerName.value.trim()) return alert('Please input your name');
    cartStore.customerName = customerName.value;
    emit('confirm-payment');
};
</script>

<template>
    <BaseModal :is-open="isOpen" @close="$emit('close')">
        <div class="relative bg-white w-full rounded-3xl p-6 shadow-2xl overflow-hidden">

            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Checkout</h2>
                <button @click="$emit('close')" class="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <!-- List Pesanan Ringkas -->
            <div class="bg-gray-50 rounded-2xl p-4 mb-6 max-h-48 overflow-y-auto">
                <div v-for="item in cartStore.items" :key="item.cartId"
                    class="flex justify-between items-start mb-3 last:mb-0 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <div class="flex-1">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex gap-2 items-center">
                                <img :src="item.image" class="w-12 h-12 object-contain" alt="menu image">
                                <div>
                                    <span class="font-bold text-sm text-gray-800 line-clamp-1">{{ item.name }}</span>
                                    <span class="font-bold text-sm">x{{ item.quantity }}</span>
                                </div>
                            </div>
                            <span class="font-bold text-sm text-gray-500">{{ formatPrice(item.price * item.quantity)
                            }}</span>
                        </div>
                        <div class="pt-2">
                            <span class="text-xs text-gray-700 font-bold">Notes</span>
                            <p v-if="item.notes" class="text-xs text-gray-400 italic mt-0.5">{{ item.notes }}</p>
                            <p v-else class="text-xs text-gray-400 italic mt-0.5">No additional notes</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Nama -->
            <div class="mb-6">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Name</label>
                <input v-model="customerName" type="text" placeholder="Please input your name"
                    class="w-full bg-gray-100 rounded-xl p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black" />
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-gray-200">
                <span class="text-gray-500 font-medium">Total Payment</span>
                <span class="text-xl font-bold text-gray-900">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <BaseButton @click="handlePayment"
                class="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition">
                CHECKOUT
            </BaseButton>
        </div>
    </BaseModal>
</template>