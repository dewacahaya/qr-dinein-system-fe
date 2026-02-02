<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

// Kita tidak menggunakan apiClient global agar tidak terbawa 'withCredentials: true'
// import apiClient from '@/lib/axios'; 

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: 'Image'
    },
    imgClass: {
        type: String,
        default: ''
    }
});

const imageUrl = ref(null);
const loading = ref(true);
const error = ref(false);
const errorImage = 'https://placehold.co/300?text=No+Image';

const loadImage = async () => {
    loading.value = true;
    error.value = false;

    if (!props.src || props.src.includes('placehold.co')) {
        imageUrl.value = props.src;
        loading.value = false;
        return;
    }

    // Jika URL bukan dari Ngrok, pakai langsung
    if (!props.src.includes('ngrok') && !props.src.includes('127.0.0.1')) {
        imageUrl.value = props.src;
        loading.value = false;
        return;
    }

    try {
        // GUNAKAN FETCH NATIVE TANPA CREDENTIALS
        // Ini solusi untuk error CORS "wildcard *"
        const response = await fetch(props.src, {
            headers: {
                // Header ini yang penting agar Ngrok mengizinkan lewat
                'ngrok-skip-browser-warning': 'true',
                // Opsional: beritahu server kita minta gambar
                'Accept': 'image/*'
            },
            // PENTING: Jangan kirim cookie/credentials untuk gambar statis
            // agar browser menerima Access-Control-Allow-Origin: *
            credentials: 'omit'
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();

        // Buat URL lokal
        if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl.value);
        }
        imageUrl.value = URL.createObjectURL(blob);

    } catch (err) {
        console.error("Gagal memuat gambar:", err);
        error.value = true;
        imageUrl.value = errorImage;
    } finally {
        loading.value = false;
    }
};

onMounted(loadImage);

watch(() => props.src, loadImage);

onUnmounted(() => {
    if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl.value);
    }
});
</script>

<template>
    <div class="relative w-full h-full">
        <!-- Skeleton Loading -->
        <div v-if="loading"
            class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-400 rounded-lg">
            Loading...
        </div>

        <!-- Gambar Asli -->
        <img v-if="imageUrl" :src="imageUrl" :alt="alt" :class="imgClass" @error="error = true" />

        <!-- Fallback Error (Optional visual feedback) -->
        <div v-if="error && !loading"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400">
            Img Error
        </div>
    </div>
</template>