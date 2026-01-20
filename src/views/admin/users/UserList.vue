<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUserStore } from '@/stores/user';

// Components
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const userStore = useUserStore();
const sidebarOpen = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);

const form = reactive({
    id: null,
    username: '',
    email: '',
    password: '',
    role: '',
    avatar: null
});

// Preview Image State
const imagePreview = ref(null);

// Role Options
const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Cashier', value: 'cashier' },
    { label: 'Kitchen', value: 'kitchen' }
];

// 1. Initial Data
onMounted(() => {
    userStore.fetchUsers();
});

// 2. Handle File Upload
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        imagePreview.value = URL.createObjectURL(file);
        form.avatar = imagePreview.value;
    }
};

// 3. Open Modal Add
const openAddModal = () => {
    isEditMode.value = false;
    form.id = null;
    form.username = '';
    form.email = '';
    form.password = '';
    form.role = '';
    form.avatar = null;
    imagePreview.value = null;
    showModal.value = true;
};

// 4. Open Modal Edit
const openEditModal = (user) => {
    isEditMode.value = true;
    form.id = user.id;
    form.username = user.username;
    form.email = user.email;
    form.role = user.role;
    form.password = '';

    imagePreview.value = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

    showModal.value = true;
};

const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role) {
        return alert("Please fill in Name, Email, and Role.");
    }

    if (!isEditMode.value && !form.password) {
        return alert("Password is required for new users.");
    }

    let success = false;

    if (isEditMode.value) {
        alert("Edit User feature is simulated.");
        success = true;
    } else {
        success = await userStore.createUser({ ...form });
    }

    if (success) {
        showModal.value = false;
        alert(isEditMode.value ? 'User updated successfully!' : 'User created successfully!');
    }
};

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
        await userStore.deleteUser(id);
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
                            <h1 class="text-2xl font-bold text-gray-900">Manage Users</h1>
                            <p class="text-sm text-gray-500 mt-1">Manage your staff accounts here.</p>
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
                                        <th class="px-6 py-4">No</th>
                                        <th class="px-6 py-4">Name</th>
                                        <th class="px-6 py-4">Role</th>
                                        <th class="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-if="userStore.loading">
                                        <td colspan="5" class="text-center py-10">Loading users...</td>
                                    </tr>
                                    <tr v-else-if="userStore.users.length === 0">
                                        <td colspan="5" class="text-center py-10 text-gray-400">No users found.</td>
                                    </tr>
                                    <tr v-else v-for="(user, index) in userStore.users" :key="user.id"
                                        class="hover:bg-gray-50 transition-colors">

                                        <!-- No -->
                                        <td class="px-6 py-4">
                                            {{ index + 1 }}
                                        </td>

                                        <!-- Name & Email -->
                                        <td class="px-6 py-4">
                                            <p class="font-bold text-gray-900 text-sm">{{ user.username }}</p>
                                            <p class="text-xs text-gray-400">{{ user.email }}</p>
                                        </td>

                                        <!-- Role Badge -->
                                        <td class="px-6 py-4">
                                            <span class="px-3 py-1 rounded-full text-xs font-bold capitalize" :class="{
                                                'bg-blue-100 text-blue-700': user.role === 'cashier',
                                                'bg-orange-100 text-orange-700': user.role === 'kitchen',
                                            }">
                                                {{ user.role }}
                                            </span>
                                        </td>

                                        <!-- Actions -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center justify-end gap-2">
                                                <BaseButton variant="secondary" @click="openEditModal(user)"
                                                    class="px-4 py-2 text-black rounded-lg transition">
                                                    Edit
                                                </BaseButton>
                                                <BaseButton variant="danger" @click="handleDelete(user.id)"
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
                    {{ isEditMode ? 'Edit User' : 'Add New User' }}
                </h2>
                <p class="text-sm text-gray-500">Fill in the user details below.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">

                <BaseInput v-model="form.username" label="User Name" placeholder="e.g. John Doe" required />

                <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="e.g. john@glory.com"
                    required />

                <BaseInput v-model="form.password" label="Password" type="password" placeholder="••••••••"
                    :required="!isEditMode" />
                <p v-if="isEditMode" class="text-[10px] text-gray-400 -mt-3 ml-1">*Leave blank if you don't want to
                    change password</p>

                <BaseSelect label="User Role" v-model="form.role" :options="roleOptions" placeholder="Select Role"
                    required />

                <!-- Image Upload with Preview -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Avatar /
                        Photo</label>

                    <div class="flex items-center gap-4">
                        <!-- Preview Box -->
                        <div
                            class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
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
                        :loading="userStore.loading">
                        {{ isEditMode ? 'Save Changes' : 'Create User' }}
                    </BaseButton>
                </div>
            </form>
        </div>
    </BaseModal>
</template>