<script setup>
defineProps({
    variant: {
        type: String,
        validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
    },
    block: Boolean,
    disabled: Boolean,
    loading: Boolean
});
</script>

<template>
    <button :disabled="disabled || loading"
        class="flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
        :class="[
            block ? 'w-full' : '',

            variant === 'primary' ? 'bg-gray-800 text-white hover:bg-black shadow-lg shadow-gray-300' : '',
            variant === 'secondary' ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-200' : '',
            variant === 'outline' ? 'bg-white border border-transparent text-gray-500 hover:bg-gray-50' : '',
            variant === 'ghost' ? 'bg-transparent text-gray-500 hover:text-black' : ''
        ]">
        <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>
        <slot />
    </button>
</template>