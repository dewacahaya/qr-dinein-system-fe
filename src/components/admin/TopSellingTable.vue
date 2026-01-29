<script setup>
import { formatPrice } from '../../../lib/utils';

defineProps({
    products: {
        type: Array,
        default: () => []
    }
});
</script>

<template>
    <div
        class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-6 shadow-sm dark:border-gray-800 sm:px-7.5 xl:pb-1">
        <h4 class="mb-6 text-xl font-bold text-gray-900">
            Top Selling Items
        </h4>

        <div class="flex flex-col">
            <div class="flex justify-between rounded-lg bg-gray-300">
                <div class="p-2.5 xl:p-5">
                    <h5 class="text-sm font-medium uppercase xsm:text-base text-gray-700">Product Name</h5>
                </div>
                <div class="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 class="text-sm font-medium uppercase xsm:text-base text-gray-700">Sold</h5>
                </div>
            </div>

            <div v-for="(item, key) in products" :key="key"
                class="flex flex-row justify-between border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div class="flex items-center gap-3 p-2.5 xl:p-5">
                    <p class="font-bold text-gray-900 sm:block">
                        {{ item.product_name }}
                    </p>
                </div>

                <div class=" p-2.5 sm:flex xl:p-5">
                    <p class="text-green-500 font-bold bg-green-50 px-2 py-1 rounded-lg">{{ item.total_sold }} Sold</p>
                </div>
            </div>
            <div v-if="products.length === 0" class="p-5 text-center text-gray-400">
                No sales data available yet.
            </div>
        </div>
    </div>
</template>