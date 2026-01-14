<script setup>
import { ref, onMounted, reactive } from 'vue';
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import apiClient from '../../../../lib/axios';

const sidebarOpen = ref(false);
const showModal = ref(false);
const categories = ref([]);
const loading = ref(false);
const isEditMode = ref(false);

// Form State
const form = reactive({
    id: null,
    name: '',
})

// 1. Fetch Categories
const fetchCategories = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get('/categories');
        categories.value = response.data.data;
    } catch (error) {
        console.error("Failed to fetch categories", error);
    } finally {
        loading.value = false;
    }
};

// 2. Open Modal (Add Mode)
const openAddModal = () => {
    isEditMode.value = false;
    form.id = null;
    form.name = '';
    showModal.value = true;
};

// 3. Open Modal (Edit Mode)
const openEditModal = (category) => {
    isEditMode.value = true;
    form.id = category.id;
    form.name = category.name;
    showModal.value = true;
};

// 4. Submit (Create or Update)
const handleSubmit = async () => {
    if (!form.name) return alert("Category name is required");

    try {
        if (isEditMode.value) {
            const index = categories.value.findIndex(c => c.id === form.id);
            if (index !== -1) categories.value[index].name = form.name;
            alert('Successfully updated category');
        } else {
            categories.value.push({ id: Date.now(), name: form.name });
            alert('Successfully created category');
        }
        showModal.value = false;
    } catch (error) {
        console.error(error);
        alert('Failed to manage category');
    }
};

// 5. Delete
const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        await apiClient.delete(`/admin/categories/${id}`);

        // Simulasi hapus lokal
        categories.value = categories.value.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    fetchCategories();
});
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
                            <h1 class="text-2xl font-bold text-gray-900">Manage Category</h1>
                            <p class="text-sm text-gray-500 mt-1">Manage your product categories here!</p>
                        </div>
                        <BaseButton @click="openAddModal" variant="primary" class="px-6 py-3 rounded-xl shadow-lg">
                            + Add
                        </BaseButton>
                    </div>

                    <!-- Table Container -->
                    <BaseCard :no-padding="true" class="overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm text-gray-600">
                                <thead
                                    class="bg-gray-50 text-gray-900 uppercase font-bold text-xs tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th class="px-6 py-4">ID</th>
                                        <th class="px-6 py-4">Name</th>
                                        <th class="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-if="loading">
                                        <td colspan="3" class="text-center py-10">Loading data...</td>
                                    </tr>
                                    <tr v-else-if="categories.length === 0">
                                        <td colspan="3" class="text-center py-10">Category not found</td>
                                    </tr>
                                    <tr v-else v-for="(cat, index) in categories" :key="cat.id"
                                        class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4 font-medium">{{ index + 1 }}</td>
                                        <td class="px-6 py-4 font-bold text-gray-900">{{ cat.name }}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center justify-end gap-2">
                                                <BaseButton variant="secondary" @click="openEditModal(cat)"
                                                    class="px-4 py-2 text-black rounded-lg transition">
                                                    Edit
                                                </BaseButton>
                                                <BaseButton @click="handleDelete(cat.id)"
                                                    class="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition">
                                                    Delete
                                                </BaseButton>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </BaseCard>
                </div>
            </main>
        </div>
    </div>

    <!-- MODAL FORM -->
    <BaseModal :isOpen="showModal" @close="showModal = false">
        <div class="bg-white w-full rounded-4xl p-8 shadow-2xl">
            <div class="mb-6">
                <h2 class="text-2xl font-black text-gray-900 mb-1">
                    {{ isEditMode ? 'Edit Category' : 'Add Category' }}
                </h2>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <BaseInput v-model="form.name" label="Category Name" placeholder="Example: Coffee, Snack" required />
                <div class="flex gap-3 pt-4">
                    <button type="button" @click="showModal = false"
                        class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">
                        Cancel
                    </button>
                    <BaseButton type="submit" variant="primary" class="flex-1 py-3.5 rounded-xl">
                        {{ isEditMode ? 'Save Changes' : 'Add Category' }}
                    </BaseButton>
                </div>
            </form>
        </div>
    </BaseModal>
</template>