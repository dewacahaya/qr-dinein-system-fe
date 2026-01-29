<script setup>
import { ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { formatPrice } from '../../../lib/utils';

const props = defineProps({
    seriesData: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] },
    loading: Boolean
});

const emit = defineEmits(['filter-change']);

const endDate = new Date().toISOString().split('T')[0];
const d = new Date();
d.setDate(d.getDate() - 6);
const startDate = d.toISOString().split('T')[0];

const filter = ref({ start: startDate, end: endDate });

const applyFilter = () => {
    emit('filter-change', { start: filter.value.start, end: filter.value.end });
};

const series = computed(() => [{
    name: 'Revenue',
    data: props.seriesData
}]);

const chartOptions = computed(() => ({
    colors: ['#3C50E0'],
    chart: {
        fontFamily: 'Poppins, sans-serif',
        height: 335,
        type: 'area',
        toolbar: { show: false }
    },
    stroke: { width: 2, curve: 'smooth' },
    dataLabels: { enabled: false },
    xaxis: {
        type: 'category',
        categories: props.categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
            style: { colors: '#64748B', fontSize: '11px' },
            rotate: -45
        }
    },
    yaxis: {
        labels: { formatter: (val) => formatPrice(val).replace('Rp', '') }
    },
    tooltip: {
        y: { formatter: (val) => formatPrice(val) }
    },
    fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 100] }
    },
    grid: { strokeDashArray: 4 }
}));
</script>

<template>
    <div
        class="col-span-12 rounded-4xl border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-sm sm:px-7.5 xl:col-span-8">
        <div class="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-3 mb-6">
            <div>
                <h3 class="text-xl font-bold text-gray-900">Revenue Analytics</h3>
                <p class="text-sm text-gray-500">Pendapatan per hari</p>
            </div>
            <div class="flex gap-2 items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                <input type="date" v-model="filter.start" @change="applyFilter"
                    class="bg-transparent text-xs font-bold text-gray-600 p-2 rounded outline-none cursor-pointer" />
                <span class="text-gray-400">-</span>
                <input type="date" v-model="filter.end" @change="applyFilter"
                    class="bg-transparent text-xs font-bold text-gray-600 p-2 rounded outline-none cursor-pointer" />
            </div>
        </div>

        <div class="relative min-h-87.5">
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div v-else-if="seriesData.length === 0"
                class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                No data available.
            </div>

            <div id="chartOne" class="-ml-2">
                <VueApexCharts v-if="categories.length > 0" :key="categories.join('')" type="area" height="350"
                    :options="chartOptions" :series="series" />
            </div>
        </div>
    </div>
</template>