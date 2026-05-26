<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(true)

const navItems = computed(() => {
  const items = [
    { icon: '⬛', label: 'Dashboard', to: '/admin/dashboard', roles: ['organizer', 'admin'] },
    { icon: '🎟', label: 'Événement', to: '/admin/event', roles: ['organizer', 'admin'] },
    { icon: '📋', label: 'Billets', to: '/admin/tickets', roles: ['organizer', 'admin'] },
    { icon: '📊', label: 'Rapports', to: '/admin/reports', roles: ['organizer', 'admin'] },
    { icon: '📈', label: 'Analytics', to: '/admin/analytics', roles: ['organizer', 'admin'] },
    { icon: '👥', label: 'Utilisateurs', to: '/admin/users', roles: ['admin'] },
    { icon: '📝', label: 'Contenu', to: '/admin/content', roles: ['admin'] },
    { icon: '📧', label: 'Newsletters', to: '/admin/newsletters', roles: ['admin'] },
    { icon: '🔐', label: 'Logs', to: '/admin/logs', roles: ['admin'] },
  ]
  const role = authStore.profile?.role || 'organizer'
  return items.filter(item => item.roles.includes(role))
})

async function signOut() {
  await authStore.signOut()
  router.push('/')
}
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: !sidebarOpen }]">
      <div class="sidebar-header">
        <div class="sidebar-logo" v-if="sidebarOpen">
          <span class="logo-text">LE PETIT</span>
          <span class="logo-accent">POTO</span>
        </div>
        <div class="sidebar-logo-sm" v-else>LP</div>
        <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
          <span>{{ sidebarOpen ? '◀' : '▶' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['nav-item', { active: route.path === item.to }]"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" v-if="sidebarOpen">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/scan" class="nav-item scan-link" v-if="sidebarOpen">
          <span class="nav-icon">📷</span>
          <span class="nav-label">Scanner QR</span>
        </router-link>
        <router-link to="/" class="nav-item" v-if="sidebarOpen">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">Site public</span>
        </router-link>
        <div class="user-info" v-if="sidebarOpen">
          <div class="user-avatar">{{ authStore.profile?.full_name?.[0] || '?' }}</div>
          <div class="user-details">
            <span class="user-name">{{ authStore.profile?.full_name || 'Admin' }}</span>
            <span class="user-role">{{ authStore.profile?.role }}</span>
          </div>
          <button class="logout-btn" @click="signOut" title="Déconnexion">⏻</button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #0B0B0B;
}

.sidebar {
  width: 240px;
  background: #111111;
  border-right: 1px solid rgba(245,245,245,0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}

.sidebar.collapsed { width: 64px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(245,245,245,0.08);
  min-height: 64px;
}

.sidebar-logo {
  display: flex;
  gap: 5px;
  align-items: baseline;
  white-space: nowrap;
}

.logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  color: #F5F5F5;
}

.logo-accent {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  color: #FF7A00;
}

.sidebar-logo-sm {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  color: #FF7A00;
  letter-spacing: 0.05em;
}

.sidebar-toggle {
  background: rgba(245,245,245,0.06);
  border: 1px solid rgba(245,245,245,0.08);
  color: rgba(245,245,245,0.5);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.sidebar-toggle:hover { color: #FF7A00; border-color: #FF7A00; }

.sidebar-nav {
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(245,245,245,0.55);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
}

.nav-item:hover {
  background: rgba(255,122,0,0.08);
  color: #F5F5F5;
}

.nav-item.active {
  background: rgba(255,122,0,0.12);
  color: #FF7A00;
  border: 1px solid rgba(255,122,0,0.2);
}

.scan-link {
  background: rgba(123,46,255,0.1);
  border: 1px solid rgba(123,46,255,0.2);
  color: #c49dff;
  margin-bottom: 8px;
}

.nav-icon { font-size: 1rem; flex-shrink: 0; width: 20px; text-align: center; }
.nav-label { font-size: 0.85rem; }

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(245,245,245,0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(245,245,245,0.04);
  border-radius: 10px;
  margin-top: 4px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF7A00, #7B2EFF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: white;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #F5F5F5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.7rem;
  color: #FF7A00;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.logout-btn {
  background: none;
  border: none;
  color: rgba(245,245,245,0.3);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  padding: 4px;
}

.logout-btn:hover { color: #ef4444; }

.admin-main {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: #0B0B0B;
  transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
}

.sidebar.collapsed ~ .admin-main { margin-left: 64px; }

@media (max-width: 768px) {
  .sidebar { width: 64px; }
  .admin-main { margin-left: 64px; }
}
</style>