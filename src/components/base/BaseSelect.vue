<script setup>
defineProps({
    modelValue: [String, Number],
    options: {
        type: Array,
        default: () => []
    },
    label: String,
    placeholder: {
        type: String,
        default: 'Select an option'
    },
    error: String,
    disabled: Boolean
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="w-full">
        <label v-if="label" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            {{ label }}
        </label>

        <div class="relative">
            <select :value="modelValue" :disabled="disabled" @change="$emit('update:modelValue', $event.target.value)"
                class="w-full appearance-none bg-[#F8F9FD] text-gray-400 text-sm font-medium rounded-2xl p-4 pr-10 focus:outline-none focus:ring-2 focus:bg-white transition-all border border-transparent cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[error ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-black hover:bg-gray-100']">
                <option value="" disabled selected>{{ placeholder }}</option>

                <option class="text-black" v-for="(opt, index) in options" :key="index" :value="typeof opt === 'object' ? opt.value : opt">
                    {{ typeof opt === 'object' ? opt.label : opt }}
                </option>
            </select>

            <!-- Custom Chevron Icon -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>

        <p v-if="error" class="text-red-500 text-xs mt-1 ml-1 font-medium">
            {{ error }}
        </p>
    </div>
</template>