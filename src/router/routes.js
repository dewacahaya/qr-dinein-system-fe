import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'; // Sesuaikan path store auth kamu

import MenuView from '@/views/customer/MenuView.vue'
import OrderStatusView from '@/views/customer/OrderStatusView.vue'
import LoginView from '@/views/auth/LoginView.vue'

// Admin Views
import AdminDashboard from '@/views/admin/DashboardView.vue'

// Cashier Views
import CashierDashboard from '@/views/cashier/DashboardView.vue'

// Kitchen Views
import KitchenDashboard from '@/views/kitchen/DashboardView.vue'
import CategoryList from '@/views/admin/categories/CategoryList.vue';
import ProductList from '@/views/admin/products/ProductList.vue';
import UserList from '@/views/admin/users/UserList.vue';
import TableList from '@/views/admin/tables/TableList.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // === CUSTOMER (Public) ===
        {
            path: '/',
            name: 'customer-menu',
            component: MenuView
        },
        {
            path: '/order-status',
            name: 'order-status',
            component: OrderStatusView
        },

        // === AUTH ===
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guest: true }
        },

        // === ADMIN (Super User) ===
        {
            path: '/admin',
            redirect: '/admin/dashboard',
            meta: { requiresAuth: true, role: 'admin' } // Group Meta
        },
        {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
            component: AdminDashboard,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/categories',
            name: 'admin-categories',
            component: CategoryList,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/products',
            name: 'admin-products',
            component: ProductList,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/users',
            name: 'admin-users',
            component: UserList,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/tables',
            name: 'admin-tables',
            component: TableList,
            meta: { requiresAuth: true, role: 'admin' }
        },

        // === CASHIER ===
        {
            path: '/cashier',
            name: 'cashier-dashboard',
            component: CashierDashboard,
            meta: { requiresAuth: true, role: 'cashier' }
        },

        // === KITCHEN ===
        {
            path: '/kitchen',
            name: 'kitchen-dashboard',
            component: KitchenDashboard,
            meta: { requiresAuth: true, role: 'kitchen' }
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Cek apakah ada token di storage tapi user belum ada di state (Kondisi Refresh)
    const hasToken = localStorage.getItem('auth_token');

    if (hasToken && !authStore.user) {
        try {
            await authStore.fetchUser();
        } catch (error) {
            // Token tidak valid lagi
            return next({ name: 'login' });
        }
    }

    // Logic Proteksi Route
    if (to.meta.requiresAuth) {
        if (!authStore.user) {
            return next({ name: 'login' });
        }

        // Cek Role
        if (to.meta.role && authStore.user.role !== to.meta.role) {
            // Salah role, kembalikan ke dashboard masing-masing
            if (authStore.isAdmin) return next({ name: 'admin-dashboard' });
            if (authStore.isCashier) return next({ name: 'cashier-dashboard' });
            if (authStore.isKitchen) return next({ name: 'kitchen-dashboard' });
        }
    }

    // Halaman Tamu (Login)
    else if (to.meta.guest && authStore.user) {
        if (authStore.isAdmin) return next({ name: 'admin-dashboard' });
        if (authStore.isCashier) return next({ name: 'cashier-dashboard' });
        return next();
    }

    next();
});

export default router;