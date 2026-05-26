<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const ticket = ref<any>(null)
const reservation = ref<any>(null)

const status = computed(() => route.query.status as string)
const reason = computed(() => route.query.reason as string)
const ref_ = computed(() => route.query.ref as string)

const isValid = computed(() => status.value === 'valid')
const isAlreadyUsed = computed(() => status.value === 'already_used')

onMounted(async () => {
  if (isValid.value && route.query.ticketId) {
    try {
      const { data } = await api.get(`/tickets?id=eq.${route.query.ticketId}`)
      if (data[0]) {
        ticket.value = data[0]
        const { data: resData } = await api.get(`/reservations?id=eq.${ticket.value.reservation_id}`)
        reservation.value = resData[0]
      }
    } catch {}
  }
  // Auto-return to scan after 5 seconds
  setTimeout(() => router.push('/scan'), 6000)
})
</script>

<template>
  <div class="result-page" :class="status">
    <div class="result-content">
      <!-- Valid -->
      <template v-if="isValid">
        <div class="result-icon valid-icon">✅</div>
        <h1 class="result-title">ACCÈS AUTORISÉ</h1>
        <div class="result-ref">{{ ref_ }}</div>

        <div v-if="reservation" class="result-details">
          <div class="detail-row">
            <span class="detail-label">Nom</span>
            <span class="detail-value">{{ reservation.buyer_name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Billet</span>
            <span class="detail-value">Ticket {{ ticket?.ticket_number }} / {{ reservation.quantity }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Événement</span>
            <span class="detail-value">{{ reservation.event_name }}</span>
          </div>
        </div>
      </template>

      <!-- Already used -->
      <template v-else-if="isAlreadyUsed">
        <div class="result-icon used-icon">⚠️</div>
        <h1 class="result-title">DÉJÀ UTILISÉ</h1>
        <div class="result-ref">{{ ref_ }}</div>
        <p class="result-reason">Ce billet a déjà été scanné.</p>
      </template>

      <!-- Invalid / Error -->
      <template v-else>
        <div class="result-icon invalid-icon">❌</div>
        <h1 class="result-title">ACCÈS REFUSÉ</h1>
        <div class="result-ref">{{ ref_ || 'QR invalide' }}</div>
        <p class="result-reason">{{ reason || 'Billet invalide ou introuvable' }}</p>
      </template>

      <div class="result-actions">
        <button class="scan-again-btn" @click="router.push('/scan')">
          📷 Scanner un autre billet
        </button>
        <p class="auto-redirect">Retour automatique dans 6 secondes...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  color: #F5F5F5;
  padding: 24px;
  transition: background 0.3s;
}

.result-page.valid { background: linear-gradient(135deg, #052015 0%, #0B0B0B 50%); }
.result-page.already_used { background: linear-gradient(135deg, #1a1200 0%, #0B0B0B 50%); }
.result-page.invalid, .result-page.error { background: linear-gradient(135deg, #1a0505 0%, #0B0B0B 50%); }

.result-content {
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.4s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  animation: bounce 0.6s ease both 0.2s;
}

@keyframes bounce {
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.result-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  letter-spacing: 0.08em;
  line-height: 1;
  margin-bottom: 12px;
}

.valid .result-title { color: #22c55e; }
.already_used .result-title { color: #f59e0b; }
.invalid .result-title, .error .result-title { color: #ef4444; }

.result-ref {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: rgba(245,245,245,0.5);
  background: rgba(245,245,245,0.06);
  padding: 8px 20px;
  border-radius: 32px;
  display: inline-block;
  margin-bottom: 24px;
}

.result-details {
  background: rgba(245,245,245,0.04);
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(245,245,245,0.06);
}

.detail-row:last-child { border-bottom: none; }
.detail-label { font-size: 0.8rem; color: rgba(245,245,245,0.4); }
.detail-value { font-size: 0.88rem; font-weight: 600; color: #F5F5F5; }

.result-reason {
  color: rgba(245,245,245,0.5);
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.result-actions { display: flex; flex-direction: column; gap: 12px; }

.scan-again-btn {
  padding: 16px 32px;
  background: rgba(245,245,245,0.08);
  border: 1.5px solid rgba(245,245,245,0.15);
  color: #F5F5F5;
  border-radius: 14px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.scan-again-btn:hover {
  background: rgba(255,122,0,0.1);
  border-color: rgba(255,122,0,0.3);
  color: #FF7A00;
}

.auto-redirect { font-size: 0.78rem; color: rgba(245,245,245,0.25); }
</style>