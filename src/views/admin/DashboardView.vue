<script setup>
import { onMounted, reactive, ref } from 'vue';
import { formatPrice } from '../../../lib/utils';
import { useDashboardStore } from '@/stores/dashboard';

import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseButton from '@/components/base/BaseButton.vue';

import ChartOne from '@/components/admin/ChartOne.vue';
import CardDataStats from '@/components/admin/CardDataStats.vue';
import TopSellingTable from '@/components/admin/TopSellingTable.vue';

const dashboardStore = useDashboardStore();
const sidebarOpen = ref(false);
const showExportModal = ref(false);

const filterForm = reactive({
    start_date: '',
    end_date: ''
});

onMounted(() => {
    dashboardStore.fetchDashboardStats();
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    dashboardStore.fetchChartData(startStr, endStr);

    filterForm.start_date = startStr;
    filterForm.end_date = endStr;
});

const handleChartFilter = ({ start, end }) => {
    dashboardStore.fetchChartData(start, end);
};

const handleExport = async () => {
    await dashboardStore.exportSales(filterForm.start_date, filterForm.end_date);
    showExportModal.value = false;
};

const formatCardValue = (card) => {
    if (card.prefix === 'Rp') return formatPrice(card.value);
    return card.value?.toString();
};
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans text-gray-900">
        <Sidebar :sidebar-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
            <main>
                <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 class="text-2xl font-black text-gray-900">Admin Dashboard</h2>
                            <p class="text-sm text-gray-500">
                                Updated: <span class="font-bold text-black">{{ dashboardStore.meta.date }} • {{
                                    dashboardStore.meta.last_updated }}</span>
                            </p>
                        </div>

                        <BaseButton @click="showExportModal = true" variant="primary"
                            class="px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Report
                        </BaseButton>
                    </div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mb-8">
                        <CardDataStats :title="dashboardStore.cards.revenue_today.label"
                            :total="formatCardValue(dashboardStore.cards.revenue_today)" rate="Today" :levelUp="true">
                            <template #icon>
                                <svg class="stroke-green-600 dark:stroke-white" width="22" height="22"
                                    viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                            </template>
                        </CardDataStats>

                        <!-- 2. Transactions Today -->
                        <CardDataStats :title="dashboardStore.cards.transactions_today.label"
                            :total="formatCardValue(dashboardStore.cards.transactions_today)" rate="Orders"
                            :levelUp="true">
                            <template #icon>
                                <!-- Icon Receipt -->
                                <svg class="stroke-blue-600 dark:stroke-white" width="22" height="22"
                                    viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
                                    </path>
                                </svg>
                            </template>
                        </CardDataStats>

                        <!-- 3. Items Sold Today -->
                        <CardDataStats :title="dashboardStore.cards.items_sold_today.label"
                            :total="formatCardValue(dashboardStore.cards.items_sold_today)" rate="Pcs" :levelUp="true">
                            <template #icon>
                                <!-- Icon Box/Cube -->
                                <svg class="stroke-orange-500 dark:stroke-white" width="22" height="22"
                                    viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </template>
                        </CardDataStats>

                        <!-- 4. Revenue Month -->
                        <CardDataStats :title="dashboardStore.cards.revenue_month.label"
                            :total="formatCardValue(dashboardStore.cards.revenue_month)" rate="Monthly" :levelUp="true">
                            <template #icon>
                                <!-- Icon Calendar/Chart -->
                                <svg class="stroke-purple-600 dark:stroke-white" width="22" height="22"
                                    viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </template>
                        </CardDataStats>

                        <!-- 5. Average Order Value -->
                        <CardDataStats :title="dashboardStore.cards.average_order_value.label"
                            :total="formatCardValue(dashboardStore.cards.average_order_value)" rate="Avg"
                            :levelUp="true">
                            <template #icon>
                                <!-- Icon Percent/Tag -->
                                <svg class="stroke-teal-600 dark:stroke-white" width="22" height="22"
                                    viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                </svg>
                            </template>
                        </CardDataStats>

                        <!-- 6. Kitchen Load (Active Orders) -->
                        <CardDataStats :title="dashboardStore.cards.kitchen_load.label"
                            :total="formatCardValue(dashboardStore.cards.kitchen_load)"
                            :rate="dashboardStore.cards.kitchen_load.status"
                            :levelUp="dashboardStore.cards.kitchen_load.status === 'Normal'">
                            <template #icon>
                                <!-- Icon Fire/Cooking -->
                                <svg class="stroke-red-600 dark:stroke-white" width="22" height="22" viewBox="0 0 24 24"
                                    fill="none" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z">
                                    </path>
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                                </svg>
                            </template>
                        </CardDataStats>
                    </div>
                    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                        <div class="col-span-12 xl:col-span-8">
                            <ChartOne :seriesData="dashboardStore.chartSeries"
                                :categories="dashboardStore.chartCategories" :loading="dashboardStore.loading"
                                @filter-change="handleChartFilter" />
                        </div>
                        <div class="col-span-12 xl:col-span-4">
                            <TopSellingTable :products="dashboardStore.topSellingItems" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <BaseModal :isOpen="showExportModal" @close="showExportModal = false">
            <div class="bg-white w-full rounded-4xl p-8 shadow-2xl">
                <h2 class="text-xl font-black text-gray-900 mb-4">Export Sales Report</h2>
                <form @submit.prevent="handleExport" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start
                                Date</label>
                            <input v-model="filterForm.start_date" type="date"
                                class="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border border-transparent focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                                required />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End
                                Date</label>
                            <input v-model="filterForm.end_date" type="date"
                                class="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border border-transparent focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                                required />
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="showExportModal = false"
                            class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                        <BaseButton type="submit" variant="primary" class="flex-1 py-3.5 rounded-xl">Download CSV
                        </BaseButton>
                    </div>
                </form>
            </div>
        </BaseModal>
    </div>
</template>