<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const reservations = ref<any[]>([])
const tickets = ref<any[]>([])

onMounted(async () => {
  try {
    const [resaRes, ticketRes] = await Promise.all([
      api.get('/reservations?order=created_at.desc&limit=200'),
      api.get('/tickets?limit=1000'),
    ])
    reservations.value = resaRes.data
    tickets.value = ticketRes.data
  } catch {}
  loading.value = false
})

const totalRevenue = computed(() =>
  reservations.value.filter(r => r.payment_status === 'confirmed').reduce((sum, r) => sum + r.total_price, 0)
)

const confirmedCount = computed(() => reservations.value.filter(r => r.payment_status === 'confirmed').length)
const pendingCount = computed(() => reservations.value.filter(r => r.payment_status === 'pending').length)
const ticketsSold = computed(() => tickets.value.filter(t => t.status === 'active' || t.status === 'used').length)
const ticketsUsed = computed(() => tickets.value.filter(t => t.status === 'used').length)

const recent = computed(() => reservations.value.slice(0, 8))

const paymentMethodStats = computed(() => {
  const methods: Record<string, number> = {}
  reservations.value.filter(r => r.payment_status === 'confirmed').forEach(r => {
    methods[r.payment_method] = (methods[r.payment_method] || 0) + 1
  })
  return Object.entries(methods).map(([k, v]) => ({ name: k, count: v }))
})

function formatCurrency(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

function statusColor(s: string) {
  return s === 'confirmed' ? '#22c55e' : s === 'pending' ? '#f59e0b' : '#ef4444'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Bonjour {{ authStore.profile?.full_name || 'Admin' }} 👋</p>
      </div>
      <router-link to="/scan" class="scan-btn">📷 Scanner billets</router-link>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>Chargement...
    </div>

    <template v-else>
      <!-- KPI cards -->
      <div class="kpi-grid">
        <div class="kpi-card revenue">
          <div class="kpi-icon">💰</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ formatCurrency(totalRevenue) }}</div>
            <div class="kpi-label">Revenus totaux</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">🎟</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ ticketsSold }}</div>
            <div class="kpi-label">Billets vendus</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">✅</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ confirmedCount }}</div>
            <div class="kpi-label">Commandes confirmées</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">📷</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ ticketsUsed }}</div>
            <div class="kpi-label">Billets scannés</div>
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="capacity-card">
        <div class="capacity-header">
          <span class="capacity-title">Capacité de l'événement</span>
          <span class="capacity-pct">{{ Math.round((ticketsSold / 500) * 100) }}%</span>
        </div>
        <div class="capacity-bar">
          <div class="capacity-fill" :style="{ width: `${Math.min(100, (ticketsSold/500)*100)}%` }"></div>
        </div>
        <div class="capacity-legend">
          <span>{{ ticketsSold }} vendus</span>
          <span>{{ 500 - ticketsSold }} restants</span>
          <span>500 total</span>
        </div>
      </div>

      <div class="grid-two">
        <!-- Recent orders -->
        <div class="table-card">
          <div class="card-head">
            <h3>Commandes récentes</h3>
            <router-link to="/admin/tickets" class="view-all">Tout voir →</router-link>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Acheteur</th>
                  <th>Qté</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in recent" :key="r.id">
                  <td class="ref-cell">{{ r.reference }}</td>
                  <td>{{ r.buyer_name }}</td>
                  <td>{{ r.quantity }}</td>
                  <td>{{ r.total_price.toLocaleString('fr-FR') }}</td>
                  <td>
                    <span class="status-badge" :style="{ color: statusColor(r.payment_status) }">
                      ● {{ r.payment_status }}
                    </span>
                  </td>
                  <td class="date-cell">{{ r.created_at ? formatDate(r.created_at) : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment methods -->
        <div class="stats-card">
          <div class="card-head">
            <h3>Méthodes de paiement</h3>
          </div>
          <div class="pm-stats">
            <div v-for="pm in paymentMethodStats" :key="pm.name" class="pm-row">
              <span class="pm-name">{{ pm.name }}</span>
              <div class="pm-bar-wrap">
                <div class="pm-bar" :style="{ width: `${(pm.count / confirmedCount) * 100}%` }"></div>
              </div>
              <span class="pm-count">{{ pm.count }}</span>
            </div>
            <div v-if="paymentMethodStats.length === 0" class="empty-pm">Aucune donnée</div>
          </div>

          <div class="pending-alert" v-if="pendingCount > 0">
            <span class="alert-icon">⚠️</span>
            <span>{{ pendingCount }} commande{{ pendingCount > 1 ? 's' : '' }} en attente de paiement</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 32px;
  font-family: 'Space Grotesk', sans-serif;
  color: #F5F5F5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 0.04em;
  color: #F5F5F5;
  line-height: 1;
  margin-bottom: 4px;
}

.page-header p { font-size: 0.9rem; color: rgba(245,245,245,0.5); }

.scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(123,46,255,0.1);
  border: 1.5px solid rgba(123,46,255,0.3);
  color: #c49dff;
  border-radius: 32px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s;
}

.scan-btn:hover { background: rgba(123,46,255,0.2); }

.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(245,245,245,0.5);
  padding: 40px 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,122,0,0.2);
  border-top-color: #FF7A00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.2s;
}

.kpi-card:hover { border-color: rgba(255,122,0,0.2); }
.kpi-card.revenue { border-color: rgba(255,122,0,0.2); background: rgba(255,122,0,0.05); }

.kpi-icon { font-size: 2rem; }
.kpi-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.04em;
  color: #FF7A00;
  line-height: 1;
  margin-bottom: 4px;
}

.kpi-label { font-size: 0.78rem; color: rgba(245,245,245,0.45); text-transform: uppercase; letter-spacing: 0.06em; }

.capacity-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.capacity-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.capacity-title { font-weight: 600; font-size: 0.9rem; }
.capacity-pct { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.04em; color: #FF7A00; }

.capacity-bar {
  height: 8px;
  background: rgba(245,245,245,0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7A00, #7B2EFF);
  border-radius: 4px;
  transition: width 1s ease;
}

.capacity-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: rgba(245,245,245,0.4);
}

.grid-two {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
}

.table-card, .stats-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  overflow: hidden;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(245,245,245,0.06);
}

.card-head h3 { font-size: 0.9rem; font-weight: 700; letter-spacing: 0.02em; }
.view-all { font-size: 0.8rem; color: #FF7A00; text-decoration: none; }

.table-wrap { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

th {
  text-align: left;
  padding: 10px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,245,245,0.35);
  border-bottom: 1px solid rgba(245,245,245,0.06);
}

td {
  padding: 12px 16px;
  font-size: 0.84rem;
  color: rgba(245,245,245,0.75);
  border-bottom: 1px solid rgba(245,245,245,0.04);
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(245,245,245,0.02); }

.ref-cell { font-family: 'Courier New', monospace; font-size: 0.78rem; color: #FF7A00; }
.date-cell { font-size: 0.78rem; color: rgba(245,245,245,0.35); }

.status-badge { font-size: 0.78rem; font-weight: 600; }

.pm-stats { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

.pm-row { display: flex; align-items: center; gap: 10px; }
.pm-name { font-size: 0.82rem; min-width: 80px; color: rgba(245,245,245,0.6); text-transform: capitalize; }
.pm-bar-wrap { flex: 1; height: 6px; background: rgba(245,245,245,0.06); border-radius: 3px; overflow: hidden; }
.pm-bar { height: 100%; background: linear-gradient(90deg, #FF7A00, #7B2EFF); border-radius: 3px; min-width: 4px; transition: width 0.6s ease; }
.pm-count { font-size: 0.82rem; font-weight: 700; color: #FF7A00; min-width: 24px; text-align: right; }
.empty-pm { font-size: 0.85rem; color: rgba(245,245,245,0.3); text-align: center; padding: 20px 0; }

.pending-alert {
  margin: 0 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 10px;
  font-size: 0.82rem;
  color: #f59e0b;
}

@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .grid-two { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .dashboard { padding: 20px 16px; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}
</style>