<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import { formatPrice } from '../../../lib/utils';

const sidebarOpen = ref(false);
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans text-gray-900">
        <Sidebar :sidebar-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
            <main>
                <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-black">Admin Dashboard</h2>
                        <p class="text-sm text-gray-500">Welcome to your admin dashboard</p>
                    </div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                        <BaseCard class="flex items-center gap-4">
                            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                                💰</div>
                            <div>
                                <h4 class="text-xl font-bold text-black">{{ formatPrice(2500000) }}</h4>
                                <span class="text-xs font-medium text-gray-500">Total Revenue</span>
                            </div>
                        </BaseCard>
                    </div>

                    <!-- Table Section -->
                    <div class="mt-8">
                        <BaseCard :no-padding="true">
                            <div class="px-6 py-4 border-b border-gray-100">
                                <h3 class="font-bold">Latest Transactions</h3>
                            </div>
                            <div class="p-6 text-center text-gray-500">No transactions found</div>
                        </BaseCard>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>