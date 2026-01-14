<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const authStore = useAuthStore();

const router = useRouter();

const form = ref({
    email: '',
    password: ''
});

const loading = ref(false);
const errorMsg = ref('');

// const handleLogin = async () => {
//     loading.value = true;
//     errorMsg.value = '';

//     try {
//         // Simulasi Login API Call
//         await new Promise(resolve => setTimeout(resolve, 1500));

//         // Logic routing sederhana berdasarkan email (Simulasi Role untuk Development)
//         // Nanti diganti dengan logic cek role dari response API
//         if (form.value.email.includes('admin')) {
//             router.push('/admin/dashboard');
//         } else if (form.value.email.includes('cashier')) {
//             router.push('/cashier');
//         } else if (form.value.email.includes('kitchen')) {
//             router.push('/kitchen');
//         } else {
//             router.push('/admin/dashboard');
//         }

//     } catch (err) {
//         errorMsg.value = 'Email or password is incorrect';
//     } finally {
//         loading.value = false;
//     }
// };

const handleLogin = async () => {
    // Panggil action login dari store
    // Redirect sudah dihandle otomatis di dalam store (redirectByRole)
    await authStore.login({
        email: form.value.email,
        password: form.value.password
    });
};
</script>

<template>
    <div class="min-h-screen w-full flex font-sans text-gray-900 bg-white overflow-hidden">

        <!-- LEFT SIDE: BRANDING & IMAGE (Hidden on Mobile) -->
        <div class="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
            <!-- Background Image -->
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920&auto=format&fit=crop"
                alt="Coffee Background" class="absolute inset-0 w-full h-full object-cover opacity-60" />

            <!-- Overlay Content -->
            <div class="relative z-10 p-12 text-white max-w-lg">
                <h1 class="text-6xl font-black mb-6 leading-tight tracking-tight">
                    Manage your<br>
                    <span class="text-yellow-400">Coffee Shop</span><br>
                    efficiently.
                </h1>
                <p class="text-lg text-gray-300 font-medium leading-relaxed">
                    Integrated QR Code ordering management system to increase productivity and customer satisfaction at
                    GloryCafe.
                </p>
            </div>

            <!-- Abstract Decoration Glow -->
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20">
            </div>
        </div>

        <!-- RIGHT SIDE: LOGIN FORM -->
        <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#F8F9FD]">
            <div
                class="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 relative border border-white">
                <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[100px] rounded-tr-[2.5rem] z-0">
                </div>
                <div class="relative z-10">
                    <div class="mb-10">
                        <h2 class="text-3xl font-black text-gray-900 mb-2">Welcome Back!</h2>
                        <p class="text-gray-400 font-medium">Please login to start managing the shop.</p>
                    </div>
                    <form @submit.prevent="handleLogin" class="space-y-6">
                        <!-- Email Input -->
                        <div>
                            <BaseInput v-model="form.email" label="Email Address" placeholder="name@glorycafe.com"
                                type="email" required />
                        </div>

                        <!-- Password Input -->
                        <div>
                            <BaseInput v-model="form.password" label="Password" placeholder="••••••••" type="password"
                                required />
                            <div class="flex justify-end mt-2">
                                <a href="#"
                                    class="text-xs font-bold text-gray-400 hover:text-black transition-colors">Forgot
                                    Password?</a>
                            </div>
                        </div>

                        <!-- Error Message -->
                        <!-- <div v-if="errorMsg"
                            class="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl flex items-center gap-2 animate-pulse">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ errorMsg }}
                        </div> -->

                        <div v-if="authStore.error"
                            class="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl flex items-center gap-2 animate-pulse">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ authStore.error }}
                        </div>

                        <!-- Login Button -->
                        <!-- <BaseButton block variant="primary" :loading="loading"
                            class="py-4 text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40">
                            Sign In
                        </BaseButton> -->

                        <BaseButton block variant="primary" :loading="authStore.loading"
                            class="py-4 text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40">
                            LOGIN
                        </BaseButton>
                    </form>
                    <div class="mt-8 text-center">
                        <p class="text-xs text-gray-400 font-medium">
                            &copy; 2026 GloryCafe System. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>