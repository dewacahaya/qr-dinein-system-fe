import { createRouter, createWebHistory } from 'vue-router'
// import Cookies from "js-cookie"; // Aktifkan jika nanti pakai cookies
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

const checkAuth = (to, from, next) => {
    const authStore = useAuthStore();

    // Contoh Logic Nanti:
    // if (!authStore.user) return next({ name: 'login' });
    next();
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // === CUSTOMER ===
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
            component: LoginView
        },

        // === ADMIN (Super User) ===
        {
            path: '/admin',
            name: 'admin-dashboard',
            component: AdminDashboard,
            beforeEnter: (to, from, next) => { checkAuth(to, from, next); }
        },
        // Rute placeholder untuk menu sidebar admin agar tidak blank
        { path: '/admin/products', component: ProductList },
        { path: '/admin/categories', component: CategoryList },
        { path: '/admin/tables', component: AdminDashboard },
        { path: '/admin/users', component: UserList },

        // === CASHIER (Payment Monitor) ===
        {
            path: '/cashier',
            name: 'cashier-dashboard',
            component: CashierDashboard,
            beforeEnter: (to, from, next) => { checkAuth(to, from, next); }
        },

        // === KITCHEN (Order Monitor) ===
        {
            path: '/kitchen',
            name: 'kitchen-dashboard',
            component: KitchenDashboard,
            beforeEnter: (to, from, next) => { checkAuth(to, from, next); }
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
});

export default router;