<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const reservations = ref<any[]>([])
const tickets = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [r, t] = await Promise.all([
      api.get('/reservations?order=created_at.desc&limit=1000'),
      api.get('/tickets?limit=2000'),
    ])
    reservations.value = r.data
    tickets.value = t.data
  } catch {}
  loading.value = false
})

const confirmed = computed(() => reservations.value.filter(r => r.payment_status === 'confirmed'))
const totalRevenue = computed(() => confirmed.value.reduce((s, r) => s + r.total_price, 0))
const avgOrder = computed(() => confirmed.value.length ? Math.round(totalRevenue.value / confirmed.value.length) : 0)
const ticketsSold = computed(() => tickets.value.filter(t => t.status !== 'cancelled').length)
const ticketsUsed = computed(() => tickets.value.filter(t => t.status === 'used').length)
const validationRate = computed(() => ticketsSold.value ? Math.round((ticketsUsed.value / ticketsSold.value) * 100) : 0)

// Revenue by day
const revenueByDay = computed(() => {
  const map: Record<string, number> = {}
  confirmed.value.forEach(r => {
    if (!r.created_at) return
    const day = new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    map[day] = (map[day] || 0) + r.total_price
  })
  return Object.entries(map).slice(-7).map(([d, v]) => ({ day: d, value: v }))
})

const maxRevDay = computed(() => Math.max(...revenueByDay.value.map(d => d.value), 1))

function exportReservations() {
  const h = ['Référence', 'Nom', 'Email', 'Téléphone', 'Quantité', 'Total FCFA', 'Méthode', 'Statut', 'Date']
  const rows = reservations.value.map(r => [r.reference, r.buyer_name, r.buyer_email, r.buyer_phone, r.quantity, r.total_price, r.payment_method, r.payment_status, r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : ''])
  downloadCSV([h, ...rows], 'reservations')
}

function exportTickets() {
  const h = ['Référence ticket', 'Référence réservation', 'Numéro', 'Statut']
  const rows = tickets.value.map(t => [t.reference, t.reservation_id, t.ticket_number, t.status])
  downloadCSV([h, ...rows], 'tickets')
}

function downloadCSV(rows: any[][], name: string) {
  const csv = rows.map(r => r.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${name}-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
}
</script>

<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <h1>Rapports</h1>
        <p>Synthèse des ventes et performances</p>
      </div>
    </div>

    <div v-if="loading" class="loading"><div class="spinner"></div> Chargement...</div>

    <template v-else>
      <!-- Summary KPIs -->
      <div class="kpi-row">
        <div class="kpi">
          <div class="kpi-v">{{ totalRevenue.toLocaleString('fr-FR') }} FCFA</div>
          <div class="kpi-l">Revenus totaux</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ ticketsSold }}</div>
          <div class="kpi-l">Billets vendus</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ avgOrder.toLocaleString('fr-FR') }} FCFA</div>
          <div class="kpi-l">Panier moyen</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ validationRate }}%</div>
          <div class="kpi-l">Taux de validation</div>
        </div>
      </div>

      <!-- Revenue chart -->
      <div class="chart-card">
        <h3>Revenus — 7 derniers jours</h3>
        <div class="bar-chart">
          <div v-for="d in revenueByDay" :key="d.day" class="bar-col">
            <div class="bar-val">{{ (d.value / 1000).toFixed(0) }}K</div>
            <div class="bar-wrap">
              <div class="bar-fill" :style="{ height: `${(d.value / maxRevDay) * 100}%` }"></div>
            </div>
            <div class="bar-label">{{ d.day }}</div>
          </div>
          <div v-if="revenueByDay.length === 0" class="no-data">Pas encore de données</div>
        </div>
      </div>

      <!-- Export section -->
      <div class="export-section">
        <h3>Exporter les données</h3>
        <div class="export-cards">
          <div class="export-card">
            <div class="export-icon">📋</div>
            <div class="export-info">
              <div class="export-title">Réservations</div>
              <div class="export-desc">{{ reservations.length }} entrées · Toutes les commandes avec détails acheteurs</div>
            </div>
            <button class="export-btn" @click="exportReservations">⬇ CSV</button>
          </div>
          <div class="export-card">
            <div class="export-icon">🎟</div>
            <div class="export-info">
              <div class="export-title">Billets individuels</div>
              <div class="export-desc">{{ tickets.length }} billets · Références et statuts de validation</div>
            </div>
            <button class="export-btn" @click="exportTickets">⬇ CSV</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.reports-page { padding: 32px; font-family: 'Space Grotesk', sans-serif; color: #F5F5F5; }

.page-header { margin-bottom: 32px; }
.page-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.04em; line-height: 1; margin-bottom: 4px; }
.page-header p { font-size: 0.85rem; color: rgba(245,245,245,0.45); }

.loading { display: flex; align-items: center; gap: 10px; color: rgba(245,245,245,0.4); }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,122,0,0.2); border-top-color: #FF7A00; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }

.kpi {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 14px;
  padding: 20px;
}

.kpi-v { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.04em; color: #FF7A00; line-height: 1; margin-bottom: 6px; }
.kpi-l { font-size: 0.75rem; color: rgba(245,245,245,0.4); text-transform: uppercase; letter-spacing: 0.06em; }

.chart-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.chart-card h3 { font-size: 0.9rem; font-weight: 700; color: rgba(245,245,245,0.6); margin-bottom: 24px; }

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 160px;
}

.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.bar-val { font-size: 0.72rem; color: rgba(245,245,245,0.4); }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; min-height: 4px; }
.bar-fill { width: 100%; background: linear-gradient(180deg, #FF7A00, rgba(255,122,0,0.3)); border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.6s ease; }
.bar-label { font-size: 0.72rem; color: rgba(245,245,245,0.35); white-space: nowrap; }
.no-data { color: rgba(245,245,245,0.25); font-size: 0.85rem; margin: auto; }

.export-section { background: #161616; border: 1px solid rgba(245,245,245,0.08); border-radius: 16px; padding: 24px; }
.export-section h3 { font-size: 0.9rem; font-weight: 700; color: rgba(245,245,245,0.6); margin-bottom: 16px; }
.export-cards { display: flex; flex-direction: column; gap: 12px; }

.export-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(245,245,245,0.03);
  border: 1px solid rgba(245,245,245,0.06);
  border-radius: 12px;
}

.export-icon { font-size: 1.5rem; }
.export-info { flex: 1; }
.export-title { font-size: 0.9rem; font-weight: 600; color: #F5F5F5; margin-bottom: 3px; }
.export-desc { font-size: 0.78rem; color: rgba(245,245,245,0.4); }

.export-btn {
  padding: 9px 18px;
  background: rgba(255,122,0,0.1);
  border: 1.5px solid rgba(255,122,0,0.25);
  color: #FF7A00;
  border-radius: 32px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.export-btn:hover { background: rgba(255,122,0,0.2); }

@media (max-width: 900px) { .kpi-row { grid-template-columns: 1fr 1fr; } }
</style>