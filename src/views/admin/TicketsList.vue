<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const reservations = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const statusFilter = ref('all')
const page = ref(1)
const perPage = 20

onMounted(async () => {
  try {
    const { data } = await api.get('/reservations?order=created_at.desc&limit=500')
    reservations.value = data
  } catch {}
  loading.value = false
})

const filtered = computed(() => {
  let list = reservations.value
  if (statusFilter.value !== 'all') list = list.filter(r => r.payment_status === statusFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.reference?.toLowerCase().includes(q) ||
      r.buyer_name?.toLowerCase().includes(q) ||
      r.buyer_email?.toLowerCase().includes(q) ||
      r.buyer_phone?.includes(q)
    )
  }
  return list
})

const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))
const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))

function statusColor(s: string) {
  return s === 'confirmed' ? '#22c55e' : s === 'pending' ? '#f59e0b' : '#ef4444'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function exportCSV() {
  const headers = ['Référence', 'Nom', 'Email', 'Téléphone', 'Quantité', 'Montant FCFA', 'Paiement', 'Statut', 'Date']
  const rows = reservations.value.map(r => [
    r.reference, r.buyer_name, r.buyer_email, r.buyer_phone,
    r.quantity, r.total_price, r.payment_method, r.payment_status,
    r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : ''
  ])
  const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reservations-lepetitpoto-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tickets-page">
    <div class="page-header">
      <div>
        <h1>Billets vendus</h1>
        <p>{{ filtered.length }} résultat{{ filtered.length > 1 ? 's' : '' }}</p>
      </div>
      <button class="export-btn" @click="exportCSV">⬇ Exporter CSV</button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input v-model="search" class="search-input" placeholder="Rechercher par nom, email, référence..." @input="page = 1" />
      <div class="status-tabs">
        <button v-for="s in ['all','confirmed','pending','failed']" :key="s" :class="['tab', { active: statusFilter === s }]" @click="() => { statusFilter = s; page = 1 }">
          {{ s === 'all' ? 'Tous' : s === 'confirmed' ? 'Confirmés' : s === 'pending' ? 'En attente' : 'Échoués' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div> Chargement...
    </div>

    <template v-else>
      <div class="table-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Acheteur</th>
                <th>Contact</th>
                <th>Billets</th>
                <th>Montant</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in paginated" :key="r.id">
                <td class="ref-cell">{{ r.reference }}</td>
                <td class="name-cell">{{ r.buyer_name }}</td>
                <td class="contact-cell">
                  <div>{{ r.buyer_email }}</div>
                  <div class="phone">{{ r.buyer_phone }}</div>
                </td>
                <td class="center">{{ r.quantity }}</td>
                <td class="price-cell">{{ r.total_price?.toLocaleString('fr-FR') }} FCFA</td>
                <td class="method-cell">{{ r.payment_method }}</td>
                <td>
                  <span class="status-dot" :style="{ color: statusColor(r.payment_status) }">● {{ r.payment_status }}</span>
                </td>
                <td class="date-cell">{{ r.created_at ? formatDate(r.created_at) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="page === 1" @click="page--">← Précédent</button>
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="page === totalPages" @click="page++">Suivant →</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tickets-page { padding: 32px; font-family: 'Space Grotesk', sans-serif; color: #F5F5F5; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 0.04em;
  line-height: 1;
  margin-bottom: 4px;
}

.page-header p { font-size: 0.85rem; color: rgba(245,245,245,0.45); }

.export-btn {
  padding: 10px 20px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.12);
  color: rgba(245,245,245,0.7);
  border-radius: 32px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover { border-color: #FF7A00; color: #FF7A00; }

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 240px;
  padding: 12px 16px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  border-radius: 12px;
  color: #F5F5F5;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  outline: none;
}

.search-input:focus { border-color: #FF7A00; }
.search-input::placeholder { color: rgba(245,245,245,0.25); }

.status-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

.tab {
  padding: 8px 16px;
  border-radius: 32px;
  border: 1.5px solid rgba(245,245,245,0.08);
  background: none;
  color: rgba(245,245,245,0.4);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover { color: #F5F5F5; border-color: rgba(245,245,245,0.2); }
.tab.active { background: rgba(255,122,0,0.1); border-color: rgba(255,122,0,0.3); color: #FF7A00; }

.loading { display: flex; align-items: center; gap: 10px; color: rgba(245,245,245,0.4); padding: 40px 0; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,122,0,0.2); border-top-color: #FF7A00; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.table-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  overflow: hidden;
}

.table-wrap { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,245,245,0.3);
  border-bottom: 1px solid rgba(245,245,245,0.06);
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  font-size: 0.84rem;
  color: rgba(245,245,245,0.7);
  border-bottom: 1px solid rgba(245,245,245,0.04);
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(245,245,245,0.02); }

.ref-cell { font-family: 'Courier New', monospace; font-size: 0.78rem; color: #FF7A00; white-space: nowrap; }
.name-cell { font-weight: 600; color: #F5F5F5; white-space: nowrap; }
.contact-cell { line-height: 1.4; }
.contact-cell .phone { font-size: 0.76rem; color: rgba(245,245,245,0.4); }
.center { text-align: center; }
.price-cell { font-weight: 600; white-space: nowrap; }
.method-cell { font-size: 0.78rem; text-transform: capitalize; }
.status-dot { font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
.date-cell { font-size: 0.76rem; color: rgba(245,245,245,0.35); white-space: nowrap; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.page-btn {
  padding: 9px 18px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  color: rgba(245,245,245,0.6);
  border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) { border-color: #FF7A00; color: #FF7A00; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-info { font-size: 0.85rem; color: rgba(245,245,245,0.4); }
</style>