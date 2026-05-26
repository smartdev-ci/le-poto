<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Journaux d'audit et sécurité</h1>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-4">
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Connexions aujourd'hui</p>
        <p class="text-2xl font-bold text-white">156</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Tentatives échouées</p>
        <p class="text-2xl font-bold text-red-500">12</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Billets scannés</p>
        <p class="text-2xl font-bold text-green-500">89</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Alertes de sécurité</p>
        <p class="text-2xl font-bold text-orange-500">3</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
      <div class="grid md:grid-cols-4 gap-4">
        <select
          v-model="filters.type"
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">Tous les types</option>
          <option value="login">Connexion</option>
          <option value="purchase">Achat</option>
          <option value="scan">Scan QR</option>
          <option value="admin">Action admin</option>
          <option value="security">Sécurité</option>
        </select>
        <select
          v-model="filters.level"
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">Tous les niveaux</option>
          <option value="info">Information</option>
          <option value="warning">Avertissement</option>
          <option value="error">Erreur</option>
          <option value="critical">Critique</option>
        </select>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher..."
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
        />
        <button
          @click="exportLogs"
          class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Exporter les logs
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-gray-800/50 rounded-lg border border-purple-500/20 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Niveau</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Utilisateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">IP</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-700/30">
            <td class="px-6 py-4 text-gray-300 text-sm">{{ formatTimestamp(log.timestamp) }}</td>
            <td class="px-6 py-4">
              <span :class="getTypeBadgeClass(log.type)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ log.type }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="getLevelBadgeClass(log.level)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ log.level }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-300">{{ log.user || '-' }}</td>
            <td class="px-6 py-4 text-gray-300">{{ log.description }}</td>
            <td class="px-6 py-4 text-gray-400 font-mono text-xs">{{ log.ip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Security Alerts -->
    <div class="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
      <h2 class="text-xl font-semibold text-red-400 mb-4">⚠️ Alertes de sécurité récentes</h2>
      <div class="space-y-3">
        <div v-for="alert in securityAlerts" :key="alert.id" class="flex items-start gap-3 bg-red-500/10 rounded-lg p-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <p class="text-red-300 font-semibold">{{ alert.title }}</p>
            <p class="text-red-400/80 text-sm">{{ alert.description }}</p>
            <p class="text-red-400/60 text-xs mt-1">{{ formatTimestamp(alert.timestamp) }} - IP: {{ alert.ip }}</p>
          </div>
          <button class="text-red-400 hover:text-red-300 transition-colors">Voir détails</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <p class="text-gray-400 text-sm">Affichage de 1 à {{ filteredLogs.length }} sur {{ logs.length }} entrées</p>
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

const filters = ref({
  type: '',
  level: '',
  search: ''
})

const logs = ref([
  { id: '1', timestamp: '2025-01-20T14:30:00', type: 'login', level: 'info', user: 'jean@example.com', description: 'Connexion réussie', ip: '192.168.1.100' },
  { id: '2', timestamp: '2025-01-20T14:28:00', type: 'purchase', level: 'info', user: 'marie@example.com', description: 'Achat de 2 billets', ip: '192.168.1.101' },
  { id: '3', timestamp: '2025-01-20T14:25:00', type: 'scan', level: 'info', user: 'scanner1', description: 'QR code scanné - Valide', ip: '10.0.0.50' },
  { id: '4', timestamp: '2025-01-20T14:20:00', type: 'login', level: 'warning', user: 'inconnu', description: 'Échec de connexion - mot de passe incorrect', ip: '192.168.1.200' },
  { id: '5', timestamp: '2025-01-20T14:15:00', type: 'admin', level: 'info', user: 'admin@lepoto.com', description: 'Modification événement', ip: '192.168.1.1' },
  { id: '6', timestamp: '2025-01-20T14:10:00', type: 'security', level: 'error', user: '-', description: 'Tentative d\'accès non autorisé', ip: '203.0.113.50' },
  { id: '7', timestamp: '2025-01-20T14:05:00', type: 'scan', level: 'warning', user: 'scanner2', description: 'QR code déjà utilisé', ip: '10.0.0.51' },
  { id: '8', timestamp: '2025-01-20T14:00:00', type: 'login', level: 'critical', user: '-', description: 'Attaque par force brute détectée', ip: '203.0.113.100' },
])

const securityAlerts = ref([
  { id: '1', title: 'Attaque par force brute', description: 'Multiple tentatives de connexion échouées depuis la même IP', timestamp: '2025-01-20T14:00:00', ip: '203.0.113.100' },
  { id: '2', title: 'Tentative d\'accès admin', description: 'Utilisateur non autorisé tentant d\'accéder au panel admin', timestamp: '2025-01-20T13:45:00', ip: '192.168.1.250' },
  { id: '3', title: 'QR code dupliqué', description: 'Détection de billets avec QR codes identiques', timestamp: '2025-01-20T12:30:00', ip: '-' },
])

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchType = !filters.value.type || log.type === filters.value.type
    const matchLevel = !filters.value.level || log.level === filters.value.level
    const matchSearch = !filters.value.search || 
                       log.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                       log.user?.toLowerCase().includes(filters.value.search.toLowerCase())
    return matchType && matchLevel && matchSearch
  })
})

function getTypeBadgeClass(type: string): string {
  const classes: Record<string, string> = {
    login: 'bg-blue-500/20 text-blue-400',
    purchase: 'bg-green-500/20 text-green-400',
    scan: 'bg-purple-500/20 text-purple-400',
    admin: 'bg-orange-500/20 text-orange-400',
    security: 'bg-red-500/20 text-red-400'
  }
  return classes[type] || 'bg-gray-500/20 text-gray-400'
}

function getLevelBadgeClass(level: string): string {
  const classes: Record<string, string> = {
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    critical: 'bg-red-600/20 text-red-300'
  }
  return classes[level] || 'bg-gray-500/20 text-gray-400'
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function exportLogs() {
  // Logique d'export des logs
  alert('Export des logs en cours...')
}
</script>
