<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import BaseModal from '../base/BaseModal.vue';

defineProps({
    sidebarOpen: Boolean
});

defineEmits(['toggle-sidebar']);

const authStore = useAuthStore();
const showDropdown = ref(false);
const showLogoutModal = ref(false);

const currentUser = computed(() => authStore.user);
const userAvatar = computed(() => authStore.userAvatar);
const isAdmin = computed(() => authStore.isAdmin);

const openLogoutConfirmation = () => {
    showDropdown.value = false;
    showLogoutModal.value = true;
};

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const handleLogout = async () => {
    showLogoutModal.value = false;
    await authStore.logout();
};
</script>

<template>
    <header class="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm font-sans">
        <div class="flex grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
                <button v-if="isAdmin" class="z-50 block rounded-sm bg-white p-1.5 shadow-sm hover:bg-gray-50"
                    @click="$emit('toggle-sidebar')">
                    <span class="relative block h-5.5 w-5.5 cursor-pointer">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </span>
                </button>
            </div>
            <div v-if="!isAdmin"></div>
            <!-- USER AREA -->
            <div class="flex items-center gap-3 ml-auto 2xsm:gap-7">
                <div class="flex items-center gap-4">
                    <span class="hidden text-right sm:block">
                        <span class="block text-sm font-bold text-black">
                            {{ currentUser?.name || 'Staff User' }}
                        </span>
                        <span class="block text-xs font-medium text-gray-500 capitalize">
                            {{ currentUser?.role || 'Staff' }}
                        </span>
                    </span>

                    <div class="relative">
                        <div @click="toggleDropdown"
                            class="flex items-center gap-2 cursor-pointer ml-2 hover:opacity-80 transition select-none">
                            <img :src="userAvatar" alt="User Avatar"
                                class="w-9 h-9 rounded-full object-cover border border-slate-200 bg-gray-200 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-4 h-4 text-slate-500 transition-transform duration-200"
                                :class="{ 'rotate-180': showDropdown }">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>

                        <!-- Dropdown Menu -->
                        <div v-if="showDropdown"
                            class="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-down">

                            <!-- Mobile View Name (Visible inside dropdown on mobile) -->
                            <div class="px-4 py-2 border-b border-gray-100 md:hidden">
                                <p class="text-sm font-bold text-slate-800 truncate">{{ currentUser?.name }}</p>
                                <p class="text-xs text-gray-500 truncate">{{ currentUser?.email }}</p>
                            </div>

                            <router-link to="/admin/profile" @click="showDropdown = false"
                                class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                My Profile
                            </router-link>
                            <div class="border-t border-gray-100 my-1"></div>
                            <button @click="openLogoutConfirmation"
                                class="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                    </path>
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Modal Logout -->
    <BaseModal :isOpen="showLogoutModal" @close="showLogoutModal = false">
        <div
            class="w-full bg-white rounded-4xl flex flex-col items-center justify-center px-8 py-10 text-center shadow-2xl relative overflow-hidden">
            <!-- Icon Circle -->
            <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                    </path>
                </svg>
            </div>

            <h1 class="text-2xl font-black text-slate-900 mb-2">Logout Account?</h1>
            <p class="text-slate-500 mb-8 text-sm leading-relaxed max-w-62.5">
                Are you sure you want to logout from your account?
            </p>

            <div class="flex gap-3 w-full">
                <button @click="showLogoutModal = false"
                    class="flex-1 bg-gray-100 text-slate-700 hover:bg-gray-200 py-3.5 rounded-xl font-bold transition">
                    Cancel
                </button>
                <button @click="handleLogout"
                    class="flex-1 bg-red-600 text-white hover:bg-red-700 py-3.5 rounded-xl font-bold transition shadow-lg shadow-red-200">
                    Yes, Logout
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<style scoped>
.animate-fade-in-down {
    animation: fadeInDown 0.2s ease-out forwards;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>