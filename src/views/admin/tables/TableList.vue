<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useTableStore } from '@/stores/table';

// Components
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const tableStore = useTableStore();
const sidebarOpen = ref(false);

// State Modals
const showAddModal = ref(false);
const showGenerateModal = ref(false);
const showResultModal = ref(false);

// Form State
const form = reactive({
    table_number: '',
});

const selectedTable = ref(null);

onMounted(() => {
    tableStore.fetchTables();
});

const openAddModal = () => {
    form.table_number = '';
    showAddModal.value = true;
};

const handleCreate = async () => {
    if (!form.table_number) return alert("Table Number is required");

    const success = await tableStore.createTable({
        table_number: form.table_number
    });

    if (success) {
        showAddModal.value = false;
        alert('Table created successfully!');
    }
};

// --- LOGIC DELETE TABLE ---
const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this table?')) {
        await tableStore.deleteTable(id);
    }
};

const openGenerateModal = (table) => {
    selectedTable.value = table;
    showGenerateModal.value = true;
};

const handleGenerate = async () => {
    if (!selectedTable.value) return;

    // Panggil store untuk fetch blob QR
    const success = await tableStore.generateQr(selectedTable.value.id);

    if (success) {
        showGenerateModal.value = false;
        showResultModal.value = true;
    } else {
        alert("Failed to generate QR Code");
    }
};

const handleDownload = () => {
    if (!tableStore.qrCodeBlobUrl) return;
    const link = document.createElement('a');
    link.href = tableStore.qrCodeBlobUrl;
    link.download = `QR-${selectedTable.value.table_number}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-gray-100 font-sans text-gray-900">

        <!-- Sidebar -->
        <Sidebar :sidebar-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />

        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <!-- Header -->
            <Header :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <main>
                <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">

                    <!-- Page Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">Manage Tables</h1>
                            <p class="text-sm text-gray-500 mt-1">Create tables and generate QR Codes.</p>
                        </div>
                        <BaseButton @click="openAddModal" variant="primary" class="px-6 py-3 rounded-xl shadow-lg">
                            + Add Table
                        </BaseButton>
                    </div>

                    <!-- Table Grid -->
                    <div v-if="tableStore.loading" class="text-center py-20 text-gray-500">Loading tables...</div>

                    <div v-else-if="tableStore.tables.length === 0" class="text-center py-20 text-gray-400">
                        No tables found. Add one to start.
                    </div>

                    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <BaseCard v-for="table in tableStore.tables" :key="table.id" :hover="true" :no-padding="true"
                            class="group relative flex flex-col items-center p-4 transition-all"
                            @click="openGenerateModal(table)">
                            <!-- Delete Button (Top Right) -->
                            <button @click.stop="handleDelete(table.id)"
                                class="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition z-10"
                                title="Delete Table">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <!-- Table Icon -->
                            <div
                                class="w-24 h-24 mb-3 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img src="@/assets/images/table.png" alt="Table" class="w-14 h-14 opacity-50" />
                            </div>

                            <!-- Info -->
                            <h3 class="text-lg font-black text-gray-900 mb-1">
                                {{ table.table_number }}
                            </h3>
                            <p class="text-xs text-gray-400 text-center font-bold uppercase tracking-wider">Tap to
                                Generate QR</p>
                        </BaseCard>
                    </div>

                </div>
            </main>
        </div>
    </div>

    <!-- 1. MODAL ADD TABLE -->
    <BaseModal :isOpen="showAddModal" @close="showAddModal = false">
        <div class="bg-white w-full rounded-4xl p-8 shadow-2xl">
            <h2 class="text-2xl font-black text-gray-900 mb-2">Add New Table</h2>
            <p class="text-sm text-gray-500 mb-6">Enter the table number or name.</p>

            <form @submit.prevent="handleCreate" class="space-y-5">
                <BaseInput v-model="form.table_number" label="Table Number" placeholder="e.g. Meja 01 / Table A"
                    required />

                <div class="flex gap-3 pt-4">
                    <button type="button" @click="showAddModal = false"
                        class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                    <BaseButton type="submit" variant="primary" class="flex-1 py-3.5 rounded-xl"
                        :loading="tableStore.loading">
                        Create Table
                    </BaseButton>
                </div>
            </form>
        </div>
    </BaseModal>

    <!-- 2. MODAL GENERATE CONFIRM -->
    <BaseModal :isOpen="showGenerateModal" @close="showGenerateModal = false">
        <div class="bg-white w-full rounded-4xl p-8 shadow-2xl text-center">
            <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h2v2H6V6zm0 8h2v2H6v-2zm8-8h2v2h-2V6zm8 0h2v2h-2V6zM6 20h2v2H6v-2z" />
                </svg>
            </div>

            <h2 class="text-xl font-black text-gray-900 mb-2">Generate QR Code?</h2>
            <p class="text-gray-500 text-sm mb-6 px-4">
                You are about to generate a QR Code for <span class="font-bold text-gray-900">{{
                    selectedTable?.table_number }}</span>.
            </p>

            <div class="flex gap-3">
                <button @click="showGenerateModal = false"
                    class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                <BaseButton @click="handleGenerate" variant="primary" class="flex-1 py-3.5 rounded-xl"
                    :loading="tableStore.loading">
                    Generate Now
                </BaseButton>
            </div>
        </div>
    </BaseModal>

    <!-- 3. MODAL RESULT (QR DISPLAY) -->
    <BaseModal :isOpen="showResultModal" @close="showResultModal = false">
        <div class="bg-white w-full rounded-4xl p-8 shadow-2xl flex flex-col items-center text-center">
            <h2 class="text-xl font-black text-gray-900 mb-1">QR Code Ready!</h2>
            <p class="text-sm text-gray-500 mb-6">{{ selectedTable?.table_number }}</p>

            <!-- QR Image Container -->
            <div
                class="p-4 bg-white border-4 border-gray-100 rounded-3xl mb-6 relative flex items-center justify-center min-h-50 min-w-50">

                <!-- RENDER SVG DISINI -->
                <div v-if="tableStore.qrCodeSvg" v-html="tableStore.qrCodeSvg"
                    class="w-48 h-48 [&>svg]:w-full [&>svg]:h-full"></div>

                <div v-else class="flex flex-col items-center justify-center text-gray-400 text-xs animate-pulse">
                    Generating...
                </div>
            </div>

            <div class="flex gap-3 w-full">
                <button @click="showResultModal = false"
                    class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">Close</button>
                <BaseButton @click="handleDownload" variant="secondary" class="flex-1 py-3.5 rounded-xl">
                    Download
                </BaseButton>
            </div>
        </div>
    </BaseModal>

</template>