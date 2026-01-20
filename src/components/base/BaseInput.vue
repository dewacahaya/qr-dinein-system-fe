<script setup>
defineProps({
    modelValue: [String, Number],
    label: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String,
    error: String,
    disabled: Boolean,
    required: Boolean
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="w-full">
        <!-- Label -->
        <label v-if="label" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative">
            <!-- Input Field -->
            <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
                @input="$emit('update:modelValue', $event.target.value)"
                class="w-full bg-[#F8F9FD] text-gray-900 text-sm font-bold rounded-2xl p-4 focus:outline-none focus:ring-2 focus:bg-white transition-all border border-transparent placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
                :class="[
                    error
                        ? 'ring-2 ring-red-500 bg-red-50'
                        : 'focus:ring-black hover:bg-gray-100 focus:hover:bg-white'
                ]" />

            <div v-if="$slots.append" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <slot name="append" />
            </div>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-xs mt-1 ml-1 font-medium animate-pulse">
            {{ error }}
        </p>
    </div>
</template>