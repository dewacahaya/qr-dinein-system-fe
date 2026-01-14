<script setup>
import { ref, watch } from 'vue';
import { formatPrice } from '../../../lib/utils';
import BaseModal from '../base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';

const props = defineProps({
    isOpen: Boolean,
    product: Object
});

const emit = defineEmits(['close', 'add-to-cart']);

const quantity = ref(1);
const note = ref('');

watch(() => props.product, () => {
    quantity.value = 1;
    note.value = '';
});

const handleDone = () => {
    emit('add-to-cart', {
        ...props.product,
        quantity: quantity.value,
        notes: note.value
    });
    emit('close');
};
</script>

<template>
    <BaseModal :is-open="isOpen" @close="$emit('close')">
        <!-- CARD CONTENT -->
        <div class="bg-white w-full rounded-4xl p-4 shadow-2xl relative overflow-hidden">
            <button @click="$emit('close')"
                class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-gray-500">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="flex flex-col items-center text-center">
                <div class="w-32 h-32 mb-4 bg-[#F8F9FD] rounded-full flex items-center justify-center relative">
                    <img :src="product?.image" class="w-24 h-24 object-contain mix-blend-multiply relative z-10" />
                </div>
                <h3 class="text-2xl font-bold text-gray-900 leading-tight mb-1">{{ product?.name }}</h3>
                <p class="text-lg font-semibold text-gray-900 mb-4">{{ formatPrice(product?.price || 0) }}</p>
                <p class="text-xs text-gray-400 font-medium mb-6 px-2 line-clamp-3 leading-relaxed">
                    {{ product?.description || 'Description not available' }}
                </p>

                <!-- Qty Control -->
                <div class="flex items-center gap-4 mb-6 bg-[#F8F9FD] p-2 rounded-2xl border border-gray-100">
                    <button @click="quantity > 1 ? quantity-- : null"
                        class="w-10 h-10 bg-white rounded-xl shadow-sm text-lg font-bold text-gray-400 hover:text-black hover:bg-gray-50 transition">-</button>
                    <span class="text-xl font-bold w-8 text-gray-900">{{ quantity }}</span>
                    <button @click="quantity++"
                        class="w-10 h-10 bg-black text-white rounded-xl shadow-sm text-lg font-bold hover:bg-gray-800 transition">+</button>
                </div>

                <!-- Note Input -->
                <div class="w-full mb-6 text-left">
                    <label class="text-[10px] font-bold text-gray-400 tracking-wider ml-1 mb-2 block">NOTES
                        (OPTIONAL)</label>
                    <textarea v-model="note" placeholder="Example: less sugar please..."
                        class="w-full bg-[#F8F9FD] rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none border-transparent transition-all placeholder:text-gray-300"
                        rows="2"></textarea>
                </div>

                <!-- Button DONE -->
                <BaseButton @click="handleDone"
                    class="w-full bg-yellow-400 hover:bg-yellow-500 font-extrabold py-4 rounded-2xl shadow-[0_8px_20px_rgba(250,204,21,0.3)] transition-all active:scale-95 text-lg tracking-wide">
                    DONE
                </BaseButton>
            </div>
        </div>

    </BaseModal>
</template>