<script setup>
import BaseCard from '@/components/base/BaseCard.vue';
import Header from '@/components/shared/Header.vue';


</script>

<template>
    <Header />
    <div class="flex flex-col">
        <h1 class="font-bold text-4xl p-10">Hey, Kitchen</h1>
        <div class="flex flex-col">
            <h1 class="font-bold text-2xl px-10">Pending Order</h1>
            <div class="flex flex-row px-10 py-5">
                <BaseCard class="w-auto h-auto hover:bg-slate-200">Pending Order 1</BaseCard>
            </div>
        </div>
        <div class="flex flex-col pt-22">
            <h1 class="font-bold text-2xl px-10">Preparing Order</h1>
            <div class="flex flex-row px-10 py-5">
                <BaseCard class="w-auto h-auto hover:bg-slate-200">Preparing Order 1</BaseCard>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>