<script setup>
defineProps({
    isOpen: Boolean
});
defineEmits(['close']);
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">

            <!-- Backdrop (Dark Overlay) -->
            <div @click="$emit('close')"
                class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"></div>
            <div class="relative z-10 w-full max-w-md animate-scale-up">
                <slot />
            </div>

        </div>
    </Teleport>
</template>

<style scoped>
/* Utility Animations */
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

.animate-scale-up {
    animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleUp {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>