<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatPrice, getImageUrl } from '../../../lib/utils';
import { useRoute } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import { useCustomerStore } from '@/stores/customer';

import BaseButton from '@/components/base/BaseButton.vue';
import ProductModal from '@/components/customer/ProductModal.vue';
import CheckoutModal from '../../components/customer/CheckoutModal.vue';
import CartSidebar from '../../components/customer/CartSidebar.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const route = useRoute();
const cartStore = useCartStore();
const customerStore = useCustomerStore();

const activeCategory = ref('all');

const showProductModal = ref(false);
const showCheckoutModal = ref(false);
const selectedProduct = ref(null);

onMounted(async () => {
    await customerStore.initData(route.query);
});

const openProduct = (product) => {
    selectedProduct.value = product;
    showProductModal.value = true;
};

const addToCart = (item) => {
    cartStore.addToCart(item, item.quantity, item.notes);
};

const handleCheckoutProcess = async () => {
    showCheckoutModal.value = false;
    try {
        const result = await cartStore.checkout();

        // 2. Ambil Data dari Resource (sesuai OrderResource.php)
        // Response Resource biasanya dibungkus 'data'
        // Jika result.data ada isinya, pakai itu. Jika result langsung object, pakai result.
        const orderData = result.data || result;

        const orderId = orderData.id;       // <--- INI ID DARI ORDERRESOURCE
        const snapToken = orderData.snap_token;

        if (snapToken) {
            if (window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: function (paymentResult) {
                        console.log("Payment Success!", paymentResult);
                        cartStore.clearCart();

                        // 3. REDIRECT MANUAL DENGAN ID
                        if (orderId) {
                            // Gunakan Vue Router agar SPA tidak reload
                            // Import useRouter di atas: const router = useRouter();
                            // router.push({ name: 'order-status', query: { order_id: orderId } });

                            // Atau cara Window (sedikit kasar tapi pasti jalan):
                            window.location.href = `/order-status?order_id=${orderId}`;
                        } else {
                            // Fallback jika ID entah kenapa undefined
                            alert("Pembayaran berhasil! Silakan cek status pesanan.");
                            window.location.href = '/order-status';
                        }
                    },
                    onPending: function (result) {
                        // Pending biasanya juga dianggap "lanjut" untuk tracking VA
                        cartStore.clearCart();
                        if (orderId) window.location.href = `/order-status?order_id=${orderId}`;
                    },
                    onError: function (result) {
                        alert("Pembayaran gagal! Silakan coba lagi.");
                    },
                    onClose: function () {
                        alert('Anda menutup popup tanpa menyelesaikan pembayaran');
                    }
                });
            } else {
                alert("Gagal memuat sistem pembayaran. Cek koneksi internet.");
            }
        } else {
            console.error("No Snap Token", result);
            alert("Gagal membuat pesanan (Token tidak ada).");
        }
    } catch (e) {
        console.error("Checkout Error:", e);
        // Alert error spesifik jika ada (misal: "Barang X habis")
        alert(e.response?.data?.message || "Gagal checkout.");
    }
};

const filteredProducts = computed(() => {
    if (activeCategory.value === 'all') return customerStore.products;
    return customerStore.products.filter(p => {
        const productCatId = p.category_id ?? p.category?.id;
        return productCatId == activeCategory.value;
    });
});
</script>

<template>
    <div class="flex h-screen w-full bg-[#F8F9FD] text-gray-900 font-sans overflow-hidden">
        <!-- LEFT SECTION: MENU GRID -->
        <div class="flex-1 flex flex-col h-full overflow-hidden relative w-[65%] md:w-auto transition-all">
            <div
                class="px-5 py-4 md:px-10 md:py-6 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <!-- Logo Placeholder -->
                            <div class="rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                <img src="@/assets/images/logo.png" alt="logo" class="w-12 h-12">
                            </div>
                            <span
                                class="text-[14px] md:text-lg font-bold text-gray-400 tracking-widest">GloryCafe</span>
                        </div>
                        <div class="text-yellow-400 py-2 text-2xl md:text-4xl font-bold">
                            Hey, Table {{ customerStore.tableName }}
                        </div>
                        <h2 class="text-lg md:text-4xl font-semibold py-2 text-gray-900 leading-none tracking-tight">
                            Let's Order Our Menus
                        </h2>
                    </div>
                </div>
            </div>

            <!-- CATEGORY CHIPS -->
            <div class="px-5 md:px-10 py-4 shrink-0 bg-[#F8F9FD]">
                <div class="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1">

                    <!-- Tombol All -->
                    <BaseButton @click="activeCategory = 'all'"
                        :variant="activeCategory === 'all' ? 'primary' : 'outline'"
                        class="px-5 py-2.5 rounded-2xl text-[10px] md:text-sm whitespace-nowrap">
                        All Items
                    </BaseButton>

                    <BaseButton v-for="cat in customerStore.categories" :key="cat.id" @click="activeCategory = cat.id"
                        :variant="activeCategory === cat.id ? 'primary' : 'outline'"
                        class="px-5 py-2.5 rounded-2xl text-[10px] md:text-sm whitespace-nowrap">
                        {{ cat.name }}
                    </BaseButton>

                </div>
            </div>

            <!-- MENU GRID -->
            <div class="flex-1 overflow-y-auto px-5 md:px-10 pb-24 md:pb-10">
                <div v-if="customerStore.loading" class="py-20 text-center flex flex-col items-center gap-3">
                    <div class="w-6 h-6 border-2 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
                    <span class="text-xs text-gray-400 font-medium">Loading delicious menu...</span>
                </div>

                <div v-else-if="filteredProducts.length === 0" class="py-20 text-center text-gray-400">
                    <p>No products found.</p>
                </div>

                <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    <BaseCard v-for="product in filteredProducts" :key="product.id" @click="openProduct(product)"
                        :hover="true" :no-padding="true" class="group p-3 md:p-5 flex flex-col relative h-full">
                        <!-- Image Area -->
                        <div
                            class="aspect-square w-full bg-gray-50 rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden shrink-0">
                            <img :src="getImageUrl(product.image)" alt="Menu Img"
                                class="w-3/4 h-3/4 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 drop-shadow-sm" />
                        </div>

                        <!-- Info Area -->
                        <div class="flex flex-col flex-1 min-h-0">
                            <h3
                                class="font-bold text-xs sm:text-base md:text-lg text-gray-800 leading-tight line-clamp-2 mb-1 group-hover:text-yellow-600 transition-colors">
                                {{ product.name }}
                            </h3>
                            <div class="mt-auto flex justify-between items-end">
                                <p class="font-medium text-xs md:text-base text-gray-900">
                                    {{ formatPrice(product.price) }}
                                </p>
                            </div>
                        </div>
                    </BaseCard>
                </div>
            </div>
        </div>

        <!-- RIGHT SECTION: SIDEBAR -->
        <CartSidebar @open-checkout="showCheckoutModal = true" />

        <!-- MODALS -->
        <ProductModal :is-open="showProductModal" :product="selectedProduct" @close="showProductModal = false"
            @add-to-cart="addToCart" />
        <CheckoutModal :is-open="showCheckoutModal" @close="showCheckoutModal = false"
            @confirm-payment="handleCheckoutProcess" />
    </div>
</template>