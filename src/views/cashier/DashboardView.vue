<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCashierStore } from '@/stores/cashier';
import { formatPrice, getImageUrl } from '../../../lib/utils';

import Header from '@/components/shared/Header.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const cashierStore = useCashierStore();
const showModal = ref(false);
const selectedOrder = ref(null);
const audioEnabled = ref(false);

onMounted(() => {
    cashierStore.fetchOrders();
    cashierStore.listenForNewOrders();
});

onUnmounted(() => {
    cashierStore.stopListening();
});

const openDetail = (order) => {
    selectedOrder.value = order;
    showModal.value = true;
};

const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const getItemName = (item) => item.product?.name || item.name || 'Unknown';
const getItemImage = (item) => item.product?.image || item.image;

// Actions
const handleMarkPaid = async () => {
    if (!selectedOrder.value) return;
    if (confirm("Mark order as paid?")) {
        await cashierStore.markAsPaid(selectedOrder.value.id);
        showModal.value = false;
    }
};

const handleCompleteOrder = async () => {
    if (!selectedOrder.value) return;
    await cashierStore.updateStatus(selectedOrder.value.id, 'completed');
    showModal.value = false;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Header />

        <main class="p-6 md:p-10 max-w-400 mx-auto">

            <!-- Audio Button -->
            <!-- <div v-if="!audioEnabled"
                class="mb-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🔊</span>
                    <p class="text-sm text-yellow-800 font-bold">Klik tombol ini agar notifikasi order masuk berbunyi!
                    </p>
                </div>
                <button @click="enableAudio"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-xs transition shadow-md">
                    Aktifkan Suara
                </button>
            </div> -->

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 class="font-black text-3xl md:text-4xl text-gray-900">Cashier Display</h1>
                    <div class="flex items-center gap-3 mt-1">
                        <p class="text-gray-500 font-medium">Manage incoming orders & payments.</p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-bold text-gray-600">Active Orders: {{ cashierStore.activeOrders.length
                            }}</span>
                    </div>
                </div>
            </div>

            <!-- ORDER LIST GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                <div v-if="!cashierStore.activeOrders.length"
                    class="col-span-full h-64 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-400 font-medium italic">
                    No active orders
                </div>

                <transition-group name="list">
                    <BaseCard v-for="order in cashierStore.activeOrders" :key="order.id" @click="openDetail(order)"
                        :hover="true" :no-padding="true"
                        class="cursor-pointer border-l-4 p-5 relative overflow-hidden bg-white"
                        :class="order.payment_status === 'paid' ? 'border-l-green-500' : 'border-l-orange-500'">
                        <!-- Status Badge -->
                        <div class="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide"
                            :class="order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'">
                            {{ order.payment_status }}
                        </div>

                        <div class="mb-4 pr-16">
                            <h3 class="font-black text-2xl text-gray-900">#{{ order.id }}</h3>
                            <p class="text-sm font-bold text-gray-500">{{ order.table_number }} - {{
                                order.customer_name }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ formatTime(order.created_at) }}</p>
                        </div>

                        <!-- Preview Items -->
                        <div class="space-y-3">
                            <div v-for="(item, i) in (order.items || []).slice(0, 2)" :key="i"
                                class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                                    <img :src="getImageUrl(getItemImage(item))" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-center">
                                        <span class="font-bold text-gray-800 text-sm truncate">{{ getItemName(item)
                                            }}</span>
                                        <span
                                            class="font-black text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded text-xs">x{{
                                                item.qty || item.quantity }}</span>
                                    </div>
                                    <p v-if="item.notes" class="text-[10px] text-red-500 font-bold truncate mt-0.5">
                                        Note: {{ item.notes }}</p>
                                </div>
                            </div>

                            <div v-if="(order.items || []).length > 2"
                                class="text-xs text-gray-400 italic font-bold pt-1 text-center">
                                + {{ order.items.length - 2 }} more items...
                            </div>
                        </div>

                        <!-- Total Price -->
                        <div class="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                            <span class="text-xs text-gray-400 font-bold uppercase">Total</span>
                            <span class="text-lg font-black text-gray-900">{{ formatPrice(order.total_amount ||
                                order.total_price) }}</span>
                        </div>
                    </BaseCard>
                </transition-group>
            </div>
        </main>

        <!-- MODAL DETAIL -->
        <BaseModal :isOpen="showModal" @close="showModal = false">
            <div class="bg-white w-full rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

                <div class="mb-6 flex justify-between items-start">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">Order
                            Details</span>
                        <h2 class="text-4xl font-black text-gray-900">#{{ selectedOrder?.id }}</h2>
                        <span class="text-sm font-bold"
                            :class="selectedOrder?.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'">
                            Status: {{ selectedOrder?.payment_status?.toUpperCase() }} • {{
                                selectedOrder?.status?.toUpperCase() }}
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="bg-gray-900 text-white font-bold px-3 py-1 rounded-lg text-sm block mb-1">
                            {{ selectedOrder?.table_number }}
                        </span>
                        <span class="text-sm font-bold text-gray-600">{{ selectedOrder?.customer_name }}</span>
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
                                        {{ formatPrice(item.price || item.product?.price) }}
                                    </p>
                                </div>
                                <span
                                    class="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-black text-gray-800 shadow-sm">
                                    {{ item.qty || item.quantity }}x
                                </span>
                            </div>
                            <p v-if="item.notes"
                                class="mt-2 text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg inline-block border border-red-100">
                                Note {{ item.notes }}
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

                <!-- Action Buttons -->
                <div class="flex gap-4 pt-2">
                    <BaseButton @click="showModal = false"
                        class="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black font-bold py-4 rounded-xl transition text-lg">
                        Close
                    </BaseButton>

                    <BaseButton v-if="selectedOrder?.payment_status === 'unpaid'" @click="handleMarkPaid"
                        variant="primary"
                        class="flex-2 py-4 rounded-xl text-lg shadow-xl bg-green-600 hover:bg-green-700 border-none text-white">
                        💰 Mark as Paid
                    </BaseButton>

                    <BaseButton v-else-if="selectedOrder?.status === 'ready'" @click="handleCompleteOrder"
                        variant="primary"
                        class="flex-2 py-4 rounded-xl text-lg shadow-xl bg-gray-900 hover:bg-black text-white">
                        ✅ Complete Order
                    </BaseButton>

                    <BaseButton v-else disabled
                        class="flex-2 py-4 rounded-xl text-lg bg-gray-300 text-gray-500 cursor-not-allowed">
                        Cooking in Progress...
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