<script setup>
defineProps({
    hover: {
        type: Boolean,
        default: false
    },
    noPadding: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="bg-white rounded-3xl border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300"
        :class="[
            hover ? 'cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-gray-100' : '',
            noPadding ? 'p-0 overflow-hidden' : 'p-5'
        ]">
        <slot />
    </div>
</template>