<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useKitchenStore } from '@/stores/kitchen';
import { formatPrice, getImageUrl } from '../../../lib/utils';

import Header from '@/components/shared/Header.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const kitchenStore = useKitchenStore();
const showModal = ref(false);
const selectedOrder = ref(null);

onMounted(() => {
    kitchenStore.fetchOrders();
    console.log("🔥 DATA KITCHEN:", kitchenStore.orders);
    if (kitchenStore.orders.length > 0) {
        console.log("📦 Sample Item:", kitchenStore.orders[0].items[0]);
    }

    kitchenStore.listenForNewOrders();
});

onUnmounted(() => {
    kitchenStore.stopListening();
});

const openDetail = (order) => {
    selectedOrder.value = order;
    showModal.value = true;
};

const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getItemName = (item) => {
    if (item.product && item.product.name) return item.product.name;
    return item.name || 'Unknown Item';
};

const getItemImage = (item) => {
    if (item.product && item.product.image) return item.product.image;
    return item.image || null;
};

const getItemNotes = (item) => item.notes || item.note;

const handleProcessOrder = async () => {
    if (!selectedOrder.value) return;
    const nextStatus = selectedOrder.value.status === 'pending' ? 'preparing' : 'ready';
    const id = selectedOrder.value.id;
    showModal.value = false;

    await kitchenStore.updateStatus(id, nextStatus);
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Header />
        <main class="p-6 md:p-10 max-w-400 mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="font-black text-3xl md:text-4xl text-gray-900">Kitchen Display</h1>
                    <p class="text-gray-500 font-medium mt-1">Manage incoming orders efficiently.</p>
                </div>
                <div class="flex gap-4">
                    <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-bold text-gray-600">Pending: {{ kitchenStore.pendingOrders?.length ||
                            0 }}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-bold text-gray-600">Cooking: {{ kitchenStore.preparingOrders?.length
                            || 0 }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                <!-- PENDING ORDER -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3 mb-2 px-2">
                        <h2 class="font-black text-xl text-gray-400 uppercase tracking-widest">Pending</h2>
                        <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">{{
                            kitchenStore.pendingOrders?.length || 0 }}</span>
                    </div>
                    <div v-if="!kitchenStore.pendingOrders || kitchenStore.pendingOrders.length === 0"
                        class="h-64 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-medium italic">
                        No pending orders
                    </div>

                    <transition-group name="list" tag="div" class="flex flex-col gap-4">
                        <BaseCard v-for="order in kitchenStore.pendingOrders" :key="order.id" @click="openDetail(order)"
                            :hover="true" :no-padding="true"
                            class="cursor-pointer border-l-4 border-l-blue-500 p-5 relative overflow-hidden">
                            <div
                                class="absolute top-4 right-4 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                                {{ formatTime(order.created_at) }}
                            </div>

                            <div class="mb-4">
                                <h3 class="font-black text-2xl text-gray-900">#{{ order.id }}</h3>
                                <p class="text-sm font-bold text-gray-500">{{ order.table_number }} - {{
                                    order.customer_name }}</p>
                            </div>
                            <div class="space-y-1">
                                <div v-if="order.items && order.items.length > 0">
                                    <div
                                        class="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                        <div
                                            class="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                                            <img :src="getImageUrl(getItemImage(order.items[0]))"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex justify-between items-center">
                                                <span class="font-bold text-gray-800 text-sm truncate">{{
                                                    getItemName(order.items[0]) }}</span>
                                                <span
                                                    class="font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs">x{{
                                                        order.items[0].qty || order.items[0].quantity }}</span>
                                            </div>
                                            <p v-if="getItemNotes(order.items[0])"
                                                class="text-[10px] text-red-500 font-bold truncate mt-0.5">Note: {{
                                                    getItemNotes(order.items[0]) }}</p>
                                        </div>
                                    </div>
                                    <div v-if="order.items.length > 1"
                                        class="mt-2 text-xs font-bold text-gray-400 text-center">
                                        + {{ order.items.length - 1 }} more...
                                    </div>
                                </div>
                            </div>
                        </BaseCard>
                    </transition-group>
                </div>

                <!-- PREPARING ORDER -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3 mb-2 px-2">
                        <h2 class="font-black text-xl text-gray-400 uppercase tracking-widest">Cooking</h2>
                    </div>

                    <div v-if="!kitchenStore.preparingOrders.length"
                        class="h-64 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-medium italic">
                        Kitchen is idle
                    </div>

                    <transition-group name="list" tag="div" class="flex flex-col gap-4">
                        <BaseCard v-for="order in kitchenStore.preparingOrders" :key="order.id"
                            @click="openDetail(order)" :hover="true" :no-padding="true"
                            class="cursor-pointer border-l-4 border-l-yellow-500 p-5 relative bg-yellow-50/40">
                            <div class="absolute top-4 right-4 flex gap-3">
                                <div
                                    class="bg-white/80 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                    Cooking...
                                </div>
                                <div
                                    class=" bg-white/80 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                    {{ formatTime(order.updated_at || order.created_at) }}
                                </div>
                            </div>
                            <div class="mb-4">
                                <h3 class="font-black text-2xl text-gray-900">#{{ order.id }}</h3>
                                <p class="text-sm font-bold text-gray-500">{{ order.table_number }} - {{
                                    order.customer_name }}</p>
                            </div>
                            <div v-if="order.items && order.items.length > 0">
                                <div
                                    class="flex items-center gap-3 bg-white/60 p-2 rounded-xl border border-yellow-100">
                                    <div
                                        class="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                                        <img :src="getImageUrl(getItemImage(order.items[0]))"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <span class="font-bold text-gray-800 text-sm truncate">{{
                                                getItemName(order.items[0]) }}</span>
                                            <span
                                                class="font-black text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded text-xs">x{{
                                                    order.items[0].qty || order.items[0].quantity }}</span>
                                        </div>
                                        <p v-if="getItemNotes(order.items[0])"
                                            class="text-[10px] text-red-500 font-bold truncate mt-0.5">Note: {{
                                                getItemNotes(order.items[0]) }}</p>
                                    </div>
                                </div>

                                <div v-if="order.items.length > 1"
                                    class="mt-2 text-xs font-bold text-yellow-700/60 text-center">
                                    + {{ order.items.length - 1 }} more...
                                </div>
                            </div>
                        </BaseCard>
                    </transition-group>
                </div>

            </div>
        </main>

        <BaseModal :isOpen="showModal" @close="showModal = false">
            <div class="bg-white w-full rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div class="mb-6 flex justify-between items-start">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Order
                            Details</span>
                        <h2 class="text-4xl font-black text-gray-900">#{{ selectedOrder?.id }}</h2>
                    </div>
                    <div class="text-right">
                        <span class="bg-gray-900 text-white font-bold px-3 py-1 rounded-lg text-sm block mb-1"> {{
                            selectedOrder?.table_number }} - {{ selectedOrder?.customer_name }}
                        </span>
                        <span class="text-xs text-gray-500">{{ formatTime(selectedOrder?.created_at) }}</span>
                    </div>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4 border border-gray-100">
                    <div v-for="(item, i) in (selectedOrder?.items || [])" :key="i"
                        class="flex items-start gap-4 border-b border-dashed border-gray-200 last:border-0 pb-4 last:pb-0">

                        <div
                            class="w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                            <img :src="getImageUrl(getItemImage(item))" class="w-full h-full object-cover" />
                        </div>

                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold text-gray-800 text-lg leading-tight">{{ getItemName(item) }}
                                    </h4>
                                    <p class="text-xs font-bold text-gray-400 mt-0.5">
                                        {{ formatPrice(item.price || item.product?.price) }} / item
                                    </p>
                                </div>
                                <span
                                    class="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-black text-gray-800 shadow-sm">
                                    {{ item.qty || item.quantity }}x
                                </span>
                            </div>
                            <p v-if="getItemNotes(item)"
                                class="mt-2 text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg inline-block border border-red-100">
                                Note: {{ getItemNotes(item) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-8 px-2 border-t border-gray-100 pt-4">
                    <span class="text-gray-500 font-bold uppercase tracking-wide text-xs">Total Amount</span>
                    <span class="text-2xl font-black text-gray-900">
                        {{ formatPrice(selectedOrder?.total_amount || selectedOrder?.total_price) }}
                    </span>
                </div>

                <div class="flex gap-4 pt-2">
                    <button @click="showModal = false"
                        class="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black font-bold py-4 rounded-xl transition text-lg">
                        Close
                    </button>

                    <BaseButton @click="handleProcessOrder" variant="primary"
                        class="flex-2 py-4 rounded-xl text-lg shadow-xl"
                        :class="selectedOrder?.status === 'preparing' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-black'">
                        {{ selectedOrder?.status === 'pending' ? '🔥 Start Cooking' : '✅ Ready to Serve' }}
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>