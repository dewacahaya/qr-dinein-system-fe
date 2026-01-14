<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
    sidebarOpen: Boolean
});

const emit = defineEmits(['close-sidebar']);
const route = useRoute();

const menuGroups = [
    {
        name: 'MENU',
        items: [
            { label: 'Dashboard', route: '/admin', icon: 'LayoutDashboard' },
            { label: 'Category', route: '/admin/categories', icon: 'List' },
            { label: 'Manage Product', route: '/admin/products', icon: 'Coffee' },
        ]
    },
    {
        name: 'STORE',
        items: [
            { label: 'Table (QR)', route: '/admin/tables', icon: 'QrCode' },
            { label: 'Users', route: '/admin/users', icon: 'Users' },
        ]
    }
];

const isActive = (path) => route.path === path;
</script>

<template>
    <aside
        class="absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <!-- HEADER SIDEBAR -->
        <div class="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
            <router-link to="/admin" class="flex items-center gap-2">
                <div
                    class="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-black text-lg">
                    G</div>
                <span class="text-xl font-bold text-white tracking-widest">GLORY</span>
            </router-link>

            <button @click="$emit('close-sidebar')" class="block lg:hidden text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>

        <!-- MENU LIST -->
        <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <nav class="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                <div v-for="(group, index) in menuGroups" :key="index">
                    <h3 class="mb-4 ml-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{{ group.name }}</h3>

                    <ul class="mb-6 flex flex-col gap-1.5">
                        <li v-for="(item, i) in group.items" :key="i">
                            <router-link :to="item.route"
                                class="group relative flex items-center gap-2.5 rounded-xl py-3 px-4 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
                                :class="{ 'bg-gray-800 text-white': isActive(item.route) }">
                                <span class="opacity-70">
                                    <svg v-if="item.icon === 'LayoutDashboard'" class="w-5 h-5" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                        </path>
                                    </svg>
                                    <svg v-if="item.icon === 'Coffee'" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M18 8h1a4 4 0 010 8h-1"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"></path>
                                        <line x1="6" y1="1" x2="6" y2="4"></line>
                                        <line x1="10" y1="1" x2="10" y2="4"></line>
                                        <line x1="14" y1="1" x2="14" y2="4"></line>
                                    </svg>
                                    <svg v-if="item.icon === 'List'" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                    </svg>
                                    <svg v-if="item.icon === 'QrCode'" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h2v2H6V6zm0 8h2v2H6v-2zm8-8h2v2h-2V6zm8 0h2v2h-2V6zM6 20h2v2H6v-2z">
                                        </path>
                                    </svg>
                                    <svg v-if="item.icon === 'Users'" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                        </path>
                                    </svg>
                                </span>
                                {{ item.label }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </aside>
</template>