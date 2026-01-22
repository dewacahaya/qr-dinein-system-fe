<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStatusStore } from '@/stores/order-status';
import BaseButton from '@/components/base/BaseButton.vue';
import { formatPrice } from '../../../lib/utils';

const route = useRoute();
const orderStore = useOrderStatusStore();

const orderId = computed(() => route.query.order_id);

const statusUI = computed(() => {
    const step = orderStore.order?.ui_step || 0;

    let ui = { color: 'bg-gray-300', percent: 10, icon: '⏳' };

    switch (step) {
        case 1: // Pending
            ui = { color: 'bg-gray-400', desc: 'Your order has been successfully paid.', percent: 25, icon: '⏳' };
            break;
        case 2: // Preparing
            ui = { color: 'bg-yellow-500', desc: 'Your order is being prepared.', percent: 50, icon: '👨‍🍳' };
            break;
        case 3: // Ready
            ui = { color: 'bg-green-500', desc: 'Your order is ready to be served. Please wait at your table.', percent: 80, icon: '🔔' };
            break;
        case 4: // Completed
            ui = { color: 'bg-gray-900', desc: 'Your order has been successfully completed. Thank you for your order.', percent: 100, icon: '😊' };
            break;
        case 0: // Cancelled / Unpaid
            ui = { color: 'bg-red-500', desc: 'Your order has been cancelled. Please try again.', percent: 100, icon: '❌' };
            break;
    }
    return ui;
});

onMounted(() => {
    if (orderId.value) {
        orderStore.fetchOrder(orderId.value);
        orderStore.listenToOrder(orderId.value);
    }
});

onUnmounted(() => {
    if (orderId.value) {
        orderStore.stopListening(orderId.value);
    }
});
</script>

<template>
    <div class="min-h-screen w-full flex font-sans bg-white overflow-hidden">
        <div class="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920&auto=format&fit=crop"
                alt="Coffee Background" class="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div class="relative z-10 p-12 text-white max-w-lg">
                <h1 class="text-5xl font-black mb-4 leading-tight">
                    Thank You!<br> for
                    <span class="text-yellow-400">Your Order.</span>
                </h1>
                <p class="text-lg text-gray-300 font-medium">Relax while we prepare the best for your order.</p>
            </div>
        </div>
        <div class="w-full lg:w-1/2 flex flex-col h-screen relative bg-[#F8F9FD]">
            <div
                class="px-6 py-6 flex justify-center items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
                <div class="text-center">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                    <p class="font-black text-gray-900">#{{ orderStore.order?.order_id || '...' }}</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                <div class="relative w-40 h-40 mb-8 flex items-center justify-center">
                    <div v-if="orderStore.order?.ui_step > 0 && orderStore.order?.ui_step < 4"
                        class="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>

                    <div
                        class="w-full h-full bg-white rounded-full shadow-xl flex items-center justify-center relative z-10 border-4 border-white transition-all duration-500">
                        <span class="text-6xl p-5 transition-transform duration-500 transform hover:scale-110">
                            {{ statusUI.icon }}
                        </span>
                    </div>
                </div>

                <!-- Status Text -->
                <h2 class="text-3xl font-black text-gray-900 mb-2 text-center capitalize">
                    {{ orderStore.order?.status }}
                </h2>
                <p class="text-gray-500 text-center font-medium mb-4 max-w-xs leading-relaxed">
                    {{ orderStore.order?.ui_description }}
                </p>

                <!-- Order Summary Card -->
                <div
                    class="w-full max-w-sm bg-white rounded-4xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-6">

                    <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 class="font-bold text-gray-900">Your Order</h3>
                        <span class="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            {{ orderStore.order?.table_number }}
                        </span>
                    </div>

                    <!-- Loading State -->
                    <div v-if="orderStore.loading && !orderStore.order" class="flex-1 flex items-center justify-center">
                        <div class="text-center">
                            <div
                                class="w-10 h-10 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4">
                            </div>
                            <p class="text-gray-400 font-medium">Loading your order...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="orderStore.error" class="flex-1 flex items-center justify-center">
                        <div class="text-center px-6">
                            <div class="text-6xl mb-4">😢</div>
                            <h3 class="text-xl font-bold text-gray-900">Oops!</h3>
                            <p class="text-gray-500 mb-6">{{ orderStore.error }}</p>
                            <router-link to="/">
                                <BaseButton variant="primary">Back to Home</BaseButton>
                            </router-link>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div v-for="(item, idx) in orderStore.order?.items" :key="idx"
                            class="flex justify-between items-start">
                            <div class="flex gap-3">
                                <div
                                    class="bg-gray-50 border border-gray-100 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                    {{ item.qty }}x
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-gray-800 leading-tight">{{ item.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Status -->
                    <div class="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Payment
                                Status</span>
                            <span class="text-sm font-bold"
                                :class="orderStore.order?.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'">
                                {{ orderStore.order?.payment_status === 'paid' ? 'PAID' : 'UNPAID' }}
                            </span>
                        </div>
                    </div>
                </div>

                <router-link to="/">
                    <BaseButton variant="secondary"
                        class="w-full p-4 rounded-xl text-black font-bold border border-gray-200 hover:border-black hover:text-black">
                        Make Another Order
                    </BaseButton>
                </router-link>
            </div>



        </div>
    </div>
</template>
<style scoped>
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>