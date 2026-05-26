import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
    {
      path: "/",
      component: () => import("@/layouts/PublicLayout.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "event",
          name: "event",
          component: () => import("@/views/EventView.vue"),
        },
        {
          path: "tickets",
          name: "tickets",
          component: () => import("@/views/TicketPurchase.vue"),
        },
        {
          path: "login",
          name: "login",
          component: () => import("@/views/Auth/Login.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/Auth/Register.vue"),
        },
        {
          path: "my-orders",
          name: "my-orders",
          component: () => import("@/views/MyOrders.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    // Scanner PWA
    {
      path: "/scan",
      name: "scan",
      component: () => import("@/views/scanner/QrScan.vue"),
      meta: { requiresAuth: true, roles: ["organizer", "admin"] },
    },
    {
      path: "/scan/result",
      name: "scan-result",
      component: () => import("@/views/scanner/ValidationResult.vue"),
      meta: { requiresAuth: true, roles: ["organizer", "admin"] },
    },
    // Backoffice
    {
      path: "/admin",
      component: () => import("@/layouts/AdminLayout.vue"),
      meta: { requiresAuth: true, roles: ["organizer", "admin"] },
      children: [
        { path: "", redirect: "/admin/dashboard" },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/admin/Dashboard.vue"),
        },
        {
          path: "event",
          name: "event-edit",
          component: () => import("@/views/admin/EventEdit.vue"),
        },
        {
          path: "tickets",
          name: "tickets-list",
          component: () => import("@/views/admin/TicketsList.vue"),
        },
        {
          path: "reports",
          name: "reports",
          component: () => import("@/views/admin/Reports.vue"),
        },
        {
          path: "users",
          name: "users-list",
          component: () => import("@/views/admin/UsersList.vue"),
          meta: { roles: ["admin"] },
        },
        {
          path: "analytics",
          name: "analytics",
          component: () => import("@/views/admin/Analytics.vue"),
        },
        {
          path: "content",
          name: "content-manager",
          component: () => import("@/views/admin/ContentManager.vue"),
          meta: { roles: ["admin"] },
        },
        {
          path: "newsletters",
          name: "newsletters",
          component: () => import("@/views/admin/Newsletters.vue"),
          meta: { roles: ["admin"] },
        },
        {
          path: "logs",
          name: "logs",
          component: () => import("@/views/admin/Logs.vue"),
          meta: { roles: ["admin"] },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.user && authStore.loading === false) {
    // Try to restore session once
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.roles && authStore.profile) {
    const roles = to.meta.roles as string[];
    if (!roles.includes(authStore.profile.role)) {
      return { name: "home" };
    }
  }

  return true;
});

export default router;
