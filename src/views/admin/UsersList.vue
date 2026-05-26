<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
      <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        + Nouvel utilisateur
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
      <div class="grid md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
        />
        <select
          v-model="filters.role"
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">Tous les rôles</option>
          <option value="client">Client</option>
          <option value="organizer">Organisateur</option>
          <option value="admin">Admin</option>
          <option value="scanner">Scanner</option>
        </select>
        <select
          v-model="filters.status"
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-gray-800/50 rounded-lg border border-purple-500/20 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Utilisateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rôle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Inscrit le</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-700/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {{ user.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="text-white font-semibold">{{ user.fullName }}</p>
                  <p class="text-gray-400 text-sm">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getRoleBadgeClass(user.role)
              ]">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                user.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              ]">
                {{ user.active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button class="text-gray-400 hover:text-white transition-colors" title="Voir">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button class="text-gray-400 hover:text-orange-500 transition-colors" title="Modifier">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button class="text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <p class="text-gray-400 text-sm">Affichage de 1 à {{ filteredUsers.length }} sur {{ users.length }} utilisateurs</p>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50" disabled>
          Précédent
        </button>
        <button class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: string
  fullName: string
  email: string
  role: 'client' | 'organizer' | 'admin' | 'scanner'
  active: boolean
  createdAt: string
}

const filters = ref({
  search: '',
  role: '',
  status: ''
})

const users = ref<User[]>([
  { id: '1', fullName: 'Jean Dupont', email: 'jean@example.com', role: 'client', active: true, createdAt: '2025-01-15' },
  { id: '2', fullName: 'Marie Martin', email: 'marie@example.com', role: 'organizer', active: true, createdAt: '2025-01-10' },
  { id: '3', fullName: 'Paul Okomo', email: 'paul@example.com', role: 'scanner', active: true, createdAt: '2025-01-20' },
  { id: '4', fullName: 'Admin Principal', email: 'admin@lepoto.com', role: 'admin', active: true, createdAt: '2025-01-01' },
  { id: '5', fullName: 'Sophie Ndi', email: 'sophie@example.com', role: 'client', active: false, createdAt: '2025-01-18' },
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchSearch = user.fullName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                       user.email.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchRole = !filters.value.role || user.role === filters.value.role
    const matchStatus = !filters.value.status || 
                       (filters.value.status === 'active' && user.active) ||
                       (filters.value.status === 'inactive' && !user.active)
    return matchSearch && matchRole && matchStatus
  })
})

function getRoleBadgeClass(role: string): string {
  const classes: Record<string, string> = {
    client: 'bg-blue-500/20 text-blue-400',
    organizer: 'bg-purple-500/20 text-purple-400',
    admin: 'bg-red-500/20 text-red-400',
    scanner: 'bg-green-500/20 text-green-400'
  }
  return classes[role] || 'bg-gray-500/20 text-gray-400'
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    client: 'Client',
    organizer: 'Organisateur',
    admin: 'Admin',
    scanner: 'Scanner'
  }
  return labels[role] || role
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>
