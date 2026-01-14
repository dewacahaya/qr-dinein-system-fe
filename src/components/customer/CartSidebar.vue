<script setup>
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '../../../lib/utils';

defineProps({});
const emit = defineEmits(['open-checkout']);
const cartStore = useCartStore();
</script>

<template>
    <div class="h-full flex flex-col right-0 bg-white border-l border-gray-200 shadow-xl z-20 w-[35%] md:w-80 shrink-0">
        <!-- HEADER -->
        <div class="p-3 md:p-6 pb-2 border-b border-gray-100 shrink-0 text-center md:text-left">
            <h2 class="text-xs md:text-xl font-black text-gray-900 uppercase tracking-widest">Here's <span
                    class="font-medium">Your Cart</span></h2>
            <div class="mt-1 bg-black text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full inline-block">
                {{ cartStore.totalItems }} Items
            </div>
        </div>
        <!-- LIST ITEMS -->
        <div class="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 bg-gray-50">
            <!-- Empty State -->
            <div v-if="cartStore.items.length === 0"
                class="h-full flex flex-col items-center justify-center text-center opacity-40">
                <svg class="w-8 h-8 md:w-12 md:h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <p class="text-[10px] md:text-sm font-bold">Cart is Empty</p>
            </div>

            <!-- Item Card (Vertikal 1 Kolom) -->
            <div v-for="item in cartStore.items" :key="item.cartId"
                class="bg-white rounded-xl p-2 md:p-3 shadow-sm border border-gray-100 flex flex-col gap-2 relative group">
                <!-- Delete Button (Hover/Click) -->
                <button @click="cartStore.removeFromCart(item.cartId)"
                    class="absolute top-1 right-1 text-gray-300 hover:text-red-500 z-10 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>

                <!-- Image & Info -->
                <div class="flex flex-col items-center text-center">
                    <img :src="item.image" class="w-10 h-10 md:w-14 md:h-14 object-contain mix-blend-multiply mb-1" />
                    <h4 class="font-bold text-gray-900 text-[10px] md:text-sm leading-tight line-clamp-2 w-full">{{
                        item.name }}</h4>
                    <p class="text-[10px] md:text-xs text-gray-500 font-bold mt-1">{{ formatPrice(item.price) }}</p>
                </div>

                <!-- Qty Control (Tiny) -->
                <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mt-auto">
                    <button @click="item.quantity > 1 ? item.quantity-- : cartStore.removeFromCart(item.cartId)"
                        class="text-gray-500 font-bold hover:text-black">-</button>
                    <span class="text-xs font-bold">{{ item.quantity }}</span>
                    <button @click="item.quantity++" class="text-gray-500 font-bold hover:text-black">+</button>
                </div>
            </div>

        </div>

        <!-- FOOTER -->
        <div class="p-3 md:p-6 border-t border-gray-200 bg-white shrink-0">
            <div class="flex flex-col gap-1 mb-3 text-center">
                <span class="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Total</span>
                <span class="text-sm md:text-xl font-black text-gray-900 leading-none">{{
                    formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <button @click="$emit('open-checkout')" :disabled="cartStore.items.length === 0"
                class="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 rounded-xl shadow-md text-[12px] md:text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                DONE
            </button>
        </div>

    </div>
</template>