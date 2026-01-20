<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { getImageUrl } from '../../../../lib/utils';

// Components
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/shared/Header.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const userStore = useUserStore();
const sidebarOpen = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);

const form = reactive({
    id: null,
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
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

onMounted(() => {
    userStore.fetchUsers();
});

// 3. Open Modal Add
const openAddModal = () => {
    isEditMode.value = false;
    form.id = null;
    form.name = '';
    form.username = '';
    form.email = '';
    form.password = '';
    form.password_confirmation = '';

    showPassword.value = false;
    showConfirmPassword.value = false;

    form.role = '';
    form.avatar = null;
    imagePreview.value = null;
    showModal.value = true;
};

// 4. Open Modal Edit
const openEditModal = (user) => {
    isEditMode.value = true;
    form.id = user.id;
    form.name = user.name;
    form.username = user.username;
    form.email = user.email;
    form.role = user.role;
    form.password = '';
    form.password_confirmation = '';

    showPassword.value = false;
    showConfirmPassword.value = false;

    showModal.value = true;
};

const handleSubmit = async () => {
    if (!form.name || !form.username || !form.email || !form.role) {
        return alert("Please fill in Name, Username, Email, and Role.");
    }

    if (form.password && form.password !== form.password_confirmation) {
        return alert("Password confirmation does not match.");
    }

    let success = false;

    // Clone form agar aman
    const payload = { ...form };

    // Hapus password dari payload jika kosong saat edit (agar backend tidak update password jadi string kosong)
    if (isEditMode.value && !payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
    }

    if (isEditMode.value) {
        success = await userStore.updateUser(form.id, payload);
    } else {
        success = await userStore.createUser(payload);
    }

    if (success) {
        showModal.value = false;
        alert(isEditMode.value ? 'User updated successfully!' : 'User created successfully!');
    } else {
        alert(userStore.error || 'Operation failed');
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
                                        <th class="px-6 py-4">Photo</th>
                                        <th class="px-6 py-4">Username</th>
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

                                        <td class="px-6 py-4">
                                            <div
                                                class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                                                <img :src="user.avatar ? getImageUrl(user.avatar) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`"
                                                    class="w-full h-full object-cover" alt="Avatar" />
                                            </div>
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

                <BaseInput v-model="form.name" label="Name" placeholder="e.g. johndoe123" required />

                <BaseInput v-model="form.username" label="User Name" placeholder="e.g. John Doe" required />

                <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="e.g. john@glory.com"
                    required />

                <div class="space-y-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                        <BaseInput v-model="form.password" label="Password" :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••" :required="!isEditMode">
                            <template #append>
                                <button type="button" @click="showPassword = !showPassword"
                                    class="focus:outline-none hover:text-gray-600 transition">
                                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.59M5.753 5.753A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.574 2.59M9.88 9.88a3 3 0 104.24 4.24m-5.356-9.878l9.192 9.192" />
                                    </svg>
                                </button>
                            </template>
                        </BaseInput>
                    </div>

                    <div>
                        <BaseInput v-model="form.password_confirmation" label="Confirm Password"
                            :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••"
                            :required="!isEditMode || form.password.length > 0">
                            <template #append>
                                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                    class="focus:outline-none hover:text-gray-600 transition">
                                    <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.59M5.753 5.753A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.574 2.59M9.88 9.88a3 3 0 104.24 4.24m-5.356-9.878l9.192 9.192" />
                                    </svg>
                                </button>
                            </template>
                        </BaseInput>
                    </div>
                    <p v-if="isEditMode" class="text-[10px] text-gray-400 ml-1 italic">*Leave blank if you don't want to
                        change password</p>
                </div>

                <BaseSelect label="User Role" v-model="form.role" :options="roleOptions" placeholder="Select Role"
                    required />

                <div class="bg-blue-50 text-blue-600 text-xs p-3 rounded-xl flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 mt-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Profile picture will be generated automatically based on the name.</p>
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