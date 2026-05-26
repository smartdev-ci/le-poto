<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const reservations = ref<any[]>([])
const tickets = ref<any[]>([])

onMounted(async () => {
  try {
    const [r, t] = await Promise.all([
      api.get('/reservations?limit=1000&order=created_at.asc'),
      api.get('/tickets?limit=2000'),
    ])
    reservations.value = r.data
    tickets.value = t.data
  } catch {}
  loading.value = false
})

const confirmed = computed(() => reservations.value.filter(r => r.payment_status === 'confirmed'))

const totalRevenue = computed(() => confirmed.value.reduce((s, r) => s + r.total_price, 0))
const totalTickets = computed(() => tickets.value.filter(t => t.status !== 'cancelled').length)
const conversionRate = computed(() => {
  const all = reservations.value.length
  return all ? Math.round((confirmed.value.length / all) * 100) : 0
})

// Sales over time (cumulative)
const salesTimeline = computed(() => {
  let cum = 0
  return confirmed.value.map(r => {
    cum += r.quantity || 1
    return { date: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '', cum }
  }).slice(-14)
})

const maxCum = computed(() => Math.max(...salesTimeline.value.map(p => p.cum), 1))

// Hourly distribution
const byHour = computed(() => {
  const hours = Array(24).fill(0)
  confirmed.value.forEach(r => {
    if (r.created_at) hours[new Date(r.created_at).getHours()]++
  })
  return hours
})

const maxHour = computed(() => Math.max(...byHour.value, 1))

// Quantity distribution
const qtyDist = computed(() => {
  const map: Record<string, number> = {}
  reservations.value.forEach(r => {
    const k = `${r.quantity} billet${r.quantity > 1 ? 's' : ''}`
    map[k] = (map[k] || 0) + 1
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
})

const maxQty = computed(() => Math.max(...qtyDist.value.map(e => e[1]), 1))
</script>

<template>
  <div class="analytics-page">
    <div class="page-header">
      <div>
        <h1>Analytics</h1>
        <p>Statistiques détaillées de l'événement</p>
      </div>
    </div>

    <div v-if="loading" class="loading"><div class="spinner"></div> Chargement...</div>

    <template v-else>
      <!-- Top KPIs -->
      <div class="kpi-row">
        <div class="kpi kpi-main">
          <div class="kpi-v">{{ totalRevenue.toLocaleString('fr-FR') }} FCFA</div>
          <div class="kpi-l">Revenue total confirmé</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ totalTickets }}</div>
          <div class="kpi-l">Billets vendus</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ confirmed.length }}</div>
          <div class="kpi-l">Commandes confirmées</div>
        </div>
        <div class="kpi">
          <div class="kpi-v">{{ conversionRate }}%</div>
          <div class="kpi-l">Taux de conversion</div>
        </div>
      </div>

      <div class="charts-grid">
        <!-- Sales timeline -->
        <div class="chart-card wide">
          <h3>Progression des ventes</h3>
          <div class="line-chart">
            <div v-if="salesTimeline.length === 0" class="no-data">Pas encore de données</div>
            <div v-else class="line-points">
              <div v-for="(p, i) in salesTimeline" :key="i" class="line-col">
                <div class="line-bar" :style="{ height: `${(p.cum / maxCum) * 100}%` }">
                  <span class="tooltip">{{ p.cum }} billets</span>
                </div>
                <div class="line-label">{{ p.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hourly distribution -->
        <div class="chart-card">
          <h3>Achats par heure</h3>
          <div class="hour-chart">
            <div v-for="(count, hour) in byHour" :key="hour" class="hour-col">
              <div class="hour-bar-wrap">
                <div class="hour-bar" :style="{ height: `${(count / maxHour) * 100}%` }" :title="`${hour}h: ${count}`"></div>
              </div>
              <div class="hour-label" v-if="hour % 6 === 0">{{ hour }}h</div>
              <div class="hour-label" v-else></div>
            </div>
          </div>
        </div>

        <!-- Quantity distribution -->
        <div class="chart-card">
          <h3>Quantités achetées</h3>
          <div class="qty-bars">
            <div v-for="[label, count] in qtyDist" :key="label" class="qty-row">
              <span class="qty-label">{{ label }}</span>
              <div class="qty-bar-wrap">
                <div class="qty-bar" :style="{ width: `${(count / maxQty) * 100}%` }"></div>
              </div>
              <span class="qty-count">{{ count }}</span>
            </div>
            <div v-if="qtyDist.length === 0" class="no-data">Pas de données</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.analytics-page { padding: 32px; font-family: 'Space Grotesk', sans-serif; color: #F5F5F5; }

.page-header { margin-bottom: 32px; }
.page-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.04em; line-height: 1; margin-bottom: 4px; }
.page-header p { font-size: 0.85rem; color: rgba(245,245,245,0.45); }

.loading { display: flex; align-items: center; gap: 10px; color: rgba(245,245,245,0.4); }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,122,0,0.2); border-top-color: #FF7A00; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.kpi-row { display: grid; grid-template-columns: 1.5fr repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }

.kpi {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 14px;
  padding: 20px;
}

.kpi-main { border-color: rgba(255,122,0,0.2); background: rgba(255,122,0,0.04); }
.kpi-v { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.04em; color: #FF7A00; line-height: 1; margin-bottom: 6px; }
.kpi-l { font-size: 0.72rem; color: rgba(245,245,245,0.4); text-transform: uppercase; letter-spacing: 0.06em; }

.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.chart-card { background: #161616; border: 1px solid rgba(245,245,245,0.08); border-radius: 16px; padding: 24px; }
.chart-card.wide { grid-column: span 2; }
.chart-card h3 { font-size: 0.88rem; font-weight: 700; color: rgba(245,245,245,0.5); margin-bottom: 20px; }

.no-data { color: rgba(245,245,245,0.25); font-size: 0.85rem; text-align: center; padding: 40px 0; }

.line-chart { height: 140px; }
.line-points { display: flex; align-items: flex-end; gap: 6px; height: 100%; overflow: hidden; }

.line-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 6px;
  position: relative;
}

.line-bar {
  width: 100%;
  background: linear-gradient(180deg, #FF7A00, rgba(255,122,0,0.2));
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  position: relative;
  transition: height 0.6s ease;
}

.line-bar:hover .tooltip { opacity: 1; }
.tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #FF7A00;
  color: #000;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.line-label { font-size: 0.65rem; color: rgba(245,245,245,0.3); white-space: nowrap; overflow: hidden; max-width: 100%; text-overflow: ellipsis; }

.hour-chart { display: flex; align-items: flex-end; gap: 3px; height: 100px; }
.hour-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.hour-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.hour-bar { width: 100%; background: rgba(123,46,255,0.6); border-radius: 2px 2px 0 0; min-height: 1px; transition: height 0.6s ease; }
.hour-bar:hover { background: #7B2EFF; }
.hour-label { font-size: 0.62rem; color: rgba(245,245,245,0.3); }

.qty-bars { display: flex; flex-direction: column; gap: 10px; }
.qty-row { display: flex; align-items: center; gap: 10px; }
.qty-label { font-size: 0.82rem; min-width: 70px; color: rgba(245,245,245,0.6); }
.qty-bar-wrap { flex: 1; height: 8px; background: rgba(245,245,245,0.06); border-radius: 4px; overflow: hidden; }
.qty-bar { height: 100%; background: linear-gradient(90deg, #7B2EFF, #FF7A00); border-radius: 4px; min-width: 4px; transition: width 0.6s ease; }
.qty-count { font-size: 0.82rem; font-weight: 700; color: rgba(245,245,245,0.5); min-width: 24px; text-align: right; }

@media (max-width: 1000px) {
  .kpi-row { grid-template-columns: 1fr 1fr; }
  .charts-grid { grid-template-columns: 1fr; }
  .chart-card.wide { grid-column: span 1; }
}
</style>