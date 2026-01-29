<script setup>
import { formatPrice } from '../../../lib/utils';

defineProps({
    transaction: Object
});
</script>

<template>
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

        <!-- Header: ID & Date -->
        <div class="flex justify-between items-start mb-4">
            <div>
                <h4 class="font-black text-gray-900 text-lg">#{{ transaction.order_id }}</h4>
                <span class="text-xs text-gray-500 font-medium">{{ transaction.date }}</span>
            </div>
            <span class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-green-100 text-green-700">
                {{ transaction.payment_method || 'PAID' }}
            </span>
        </div>

        <!-- Details -->
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-500">Customer</span>
                <span class="font-bold text-gray-800">{{ transaction.customer_name }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-500">Table</span>
                <span class="font-bold text-gray-800">{{ transaction.table_number }}</span>
            </div>
        </div>

        <!-- Items Summary (Truncated) -->
        <div class="bg-gray-50 rounded-xl p-3 mb-4">
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {{ transaction.items_summary }}
            </p>
        </div>

        <!-- Total -->
        <div class="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase">Total</span>
            <span class="text-lg font-black text-gray-900">{{ formatPrice(transaction.total_amount) }}</span>
        </div>

    </div>
</template>