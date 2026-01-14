<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useProductStore } from '@/stores/products';
import { formatPrice } from '../../../../lib/utils';

// Components
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const productStore = useProductStore();
const sidebarOpen = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);

// Form State
const form = reactive({
    id: null,
    category_id: '',
    name: '',
    description: '',
    price: '',
    image: null,
    is_available: true
});

// Preview Image State
const imagePreview = ref(null);

const availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Not Available', value: false }
];

// 1. Initial Data
onMounted(async () => {
    await Promise.all([
        productStore.fetchProducts(),
        productStore.fetchCategories()
    ]);
});

// 2. Handle File Upload (Preview Image)
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        imagePreview.value = URL.createObjectURL(file);
        // Di Real App: form.image = file;
        // Di Mock App: Kita simpan URL preview aja biar tampil
        form.image = imagePreview.value;
    }
};

// 3. Open Modal Add
const openAddModal = () => {
    isEditMode.value = false;
    // Reset Form
    form.id = null;
    form.category_id = '';
    form.name = '';
    form.description = '';
    form.price = '';
    form.image = null;
    form.is_available = true;
    imagePreview.value = null;

    showModal.value = true;
};

// 4. Open Modal Edit
const openEditModal = (product) => {
    isEditMode.value = true;
    form.id = product.id;
    form.category_id = product.category_id;
    form.name = product.name;
    form.description = product.description;
    form.price = product.price;
    form.is_available = product.is_available;

    imagePreview.value = product.image;
    showModal.value = true;
};

// 5. Submit Form
const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id) {
        return alert("Please fill in all the required fields. (Category, Name, Price)");
    }

    let success = false;
    if (isEditMode.value) {
        success = await productStore.updateProduct(form.id, { ...form });
    } else {
        success = await productStore.createProduct({ ...form });
    }

    if (success) {
        showModal.value = false;
        alert(isEditMode.value ? 'Product successfully updated!' : 'Product successfully created!');
    }
};

// 6. Delete Product
const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        await productStore.deleteProduct(id);
    }
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
                            <h1 class="text-2xl font-bold text-gray-900">Manage Product</h1>
                            <p class="text-sm text-gray-500 mt-1">Manage your product list here!</p>
                        </div>
                        <BaseButton @click="openAddModal" variant="primary" class="px-6 py-3 rounded-xl shadow-lg">
                            + Add Menu
                        </BaseButton>
                    </div>

                    <!-- Table Container -->
                    <BaseCard :no-padding="true" class="overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm text-gray-600">
                                <thead
                                    class="bg-gray-50 text-gray-900 uppercase font-bold text-xs tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th class="px-6 py-4">Image</th>
                                        <th class="px-6 py-4">Name</th>
                                        <th class="px-6 py-4">Category</th>
                                        <th class="px-6 py-4">Price</th>
                                        <th class="px-6 py-4">Status</th>
                                        <th class="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-if="productStore.loading">
                                        <td colspan="6" class="text-center py-10">Loading data...</td>
                                    </tr>
                                    <tr v-else-if="productStore.products.length === 0">
                                        <td colspan="6" class="text-center py-10 text-gray-400">Product not found.</td>
                                    </tr>
                                    <tr v-else v-for="product in productStore.products" :key="product.id"
                                        class="hover:bg-gray-50 transition-colors">

                                        <!-- Image -->
                                        <td class="px-6 py-4">
                                            <div
                                                class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                                                <img v-if="product.image" :src="product.image"
                                                    class="w-full h-full object-cover" alt="Menu" />
                                                <span v-else class="text-xs text-gray-400">No img</span>
                                            </div>
                                        </td>

                                        <!-- Name & Desc -->
                                        <td class="px-6 py-4">
                                            <p class="font-bold text-gray-900 text-sm">{{ product.name }}</p>
                                            <p class="text-xs text-gray-400 truncate max-w-50">{{
                                                product.description }}</p>
                                        </td>

                                        <!-- Category -->
                                        <td class="px-6 py-4">
                                            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                                {{ productStore.getCategoryName(product.category_id) }}
                                            </span>
                                        </td>

                                        <!-- Price -->
                                        <td class="px-6 py-4 font-bold text-gray-900">
                                            {{ formatPrice(product.price) }}
                                        </td>

                                        <!-- Status -->
                                        <td class="px-6 py-4">
                                            <span class="px-2 py-1 rounded text-xs font-bold"
                                                :class="product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                                                {{ product.is_available ? 'Available' : 'Not Available' }}
                                            </span>
                                        </td>

                                        <!-- Actions -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center justify-end gap-2">
                                                <BaseButton variant="secondary" @click="openEditModal(product)"
                                                    class="px-4 py-2 text-black rounded-lg transition">
                                                    Edit
                                                </BaseButton>
                                                <BaseButton @click="handleDelete(product.id)"
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
        <div class="bg-white w-full rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="mb-6">
                <h2 class="text-2xl font-black text-gray-900 mb-1">
                    {{ isEditMode ? 'Edit Menu' : 'Add Menu' }}
                </h2>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <BaseSelect label="Category" v-model="form.category_id" :options="productStore.categories"
                    placeholder="Select an category" required />
                <BaseInput v-model="form.name" label="Product Name" placeholder="Example: Espresso, Cappuccino"
                    required />
                <div>
                    <label
                        class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                    <textarea v-model="form.description" rows="3" placeholder="Description..."
                        class="w-full bg-[#F8F9FD] text-gray-900 text-sm font-bold rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition-all border border-transparent resize-none placeholder:text-gray-300"></textarea>
                </div>

                <BaseInput type="number" v-model="form.price" label="Price (Rp)" placeholder="Example: 25000" required />
                <div v-if="isEditMode">
                    <BaseSelect label="Availability Status" v-model="form.is_available"
                        :options="availabilityOptions" />
                </div>

                <!-- Image Upload with Preview -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Product
                        Image</label>

                    <div class="flex items-center gap-4">
                        <!-- Preview Box -->
                        <div
                            class="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                            <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                            <span v-else class="text-[10px] text-gray-400">No Img</span>
                        </div>

                        <!-- Input File -->
                        <label
                            class="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition">
                            <span>Choose File</span>
                            <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
                        </label>
                    </div>
                </div>

                <div class="flex gap-3 pt-6">
                    <button type="button" @click="showModal = false"
                        class="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition">
                        Cancel
                    </button>
                    <BaseButton type="submit" variant="primary" class="flex-1 py-3.5 rounded-xl"
                        :loading="productStore.loading">
                        {{ isEditMode ? 'Save Changes' : 'Add Product' }}
                    </BaseButton>
                </div>
            </form>
        </div>
    </BaseModal>
</template>