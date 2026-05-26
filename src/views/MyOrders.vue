<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getReservationsByEmail } from "@/services/reservationService";
import { useQRCode } from "@/composables/useQRCode";
import type { ReservationWithTickets } from "@/types/reservation";

const authStore = useAuthStore();
const { generateQRUrl } = useQRCode();

const reservations = ref<ReservationWithTickets[]>([]);
const loading = ref(true);
const error = ref("");
const expandedId = ref<string | null>(null);

onMounted(async () => {
  if (!authStore.user?.email) return;
  try {
    reservations.value = await getReservationsByEmail(authStore.user.email);
  } catch (e) {
    error.value = "Impossible de charger vos réservations";
  } finally {
    loading.value = false;
  }
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusLabel(s: string) {
  return s === "confirmed"
    ? "Confirmé"
    : s === "pending"
      ? "En attente"
      : "Échoué";
}

function statusColor(s: string) {
  return s === "confirmed"
    ? "#22c55e"
    : s === "pending"
      ? "#f59e0b"
      : "#ef4444";
}
</script>

<template>
  <div class="orders-page">
    <!-- Navbar inline -->
    <nav class="page-nav">
      <router-link to="/" class="nav-logo">
        <span>LE PETIT</span><span class="accent">POTO</span>
      </router-link>
      <div class="nav-right">
        <router-link to="/" class="back-btn">← Retour au site</router-link>
      </div>
    </nav>

    <div class="orders-container">
      <div class="orders-header">
        <h1>Mes billets</h1>
        <p>
          Bonjour {{ authStore.profile?.full_name || authStore.user?.email }}
        </p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>

      <div v-else-if="error" class="error-state">{{ error }}</div>

      <div v-else-if="reservations.length === 0" class="empty-state">
        <div class="empty-icon">🎟</div>
        <h3>Aucune réservation</h3>
        <p>Tu n'as pas encore acheté de billets.</p>
        <router-link to="/#tickets" class="btn-primary"
          >Acheter un billet</router-link
        >
      </div>

      <div v-else class="reservations-list">
        <div
          v-for="resa in reservations"
          :key="resa.id"
          class="reservation-card"
        >
          <div
            class="resa-header"
            @click="expandedId = expandedId === resa.id ? null : resa.id"
          >
            <div class="resa-info">
              <div class="resa-ref">{{ resa.reference }}</div>
              <div class="resa-event">{{ resa.event_name }}</div>
              <div class="resa-meta">
                {{ resa.event_date }} · {{ resa.quantity }} billet{{
                  resa.quantity > 1 ? "s" : ""
                }}
                · {{ resa.total_price.toLocaleString("fr-FR") }} FCFA
              </div>
            </div>
            <div class="resa-right">
              <span
                class="status-badge"
                :style="{
                  color: statusColor(resa.payment_status),
                  borderColor: statusColor(resa.payment_status) + '40',
                  background: statusColor(resa.payment_status) + '15',
                }"
              >
                {{ statusLabel(resa.payment_status) }}
              </span>
              <div class="resa-date">
                {{ resa.created_at ? formatDate(resa.created_at) : "" }}
              </div>
              <span class="expand-icon">{{
                expandedId === resa.id ? "▲" : "▼"
              }}</span>
            </div>
          </div>

          <div v-if="expandedId === resa.id" class="tickets-expand">
            <div class="tickets-grid">
              <div
                v-for="ticket in resa.tickets"
                :key="ticket.id"
                class="ticket-card"
              >
                <img
                  :src="generateQRUrl(ticket.qr_data, { size: 150 })"
                  :alt="'QR ' + ticket.reference"
                  class="ticket-qr"
                />
                <div class="ticket-info">
                  <div class="ticket-num">
                    Ticket {{ ticket.ticket_number }}/{{ resa.quantity }}
                  </div>
                  <div class="ticket-ref">{{ ticket.reference }}</div>
                  <div
                    class="ticket-status"
                    :style="{
                      color: ticket.status === 'active' ? '#22c55e' : '#ef4444',
                    }"
                  >
                    {{
                      ticket.status === "active"
                        ? "✅ Actif"
                        : ticket.status === "used"
                          ? "✗ Utilisé"
                          : "✗ Annulé"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #0b0b0b;
  font-family: "Space Grotesk", sans-serif;
  color: #f5f5f5;
}

.page-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(11, 11, 11, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(245, 245, 245, 0.08);
}

.nav-logo {
  display: flex;
  gap: 5px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  color: #f5f5f5;
  text-decoration: none;
}
.accent {
  color: #ff7a00;
}
.back-btn {
  font-size: 0.88rem;
  color: rgba(245, 245, 245, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}
.back-btn:hover {
  color: #ff7a00;
}

.orders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
}

.orders-header {
  margin-bottom: 40px;
}
.orders-header h1 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 3rem;
  letter-spacing: 0.04em;
  color: #f5f5f5;
  line-height: 1;
}
.orders-header p {
  font-size: 0.95rem;
  color: rgba(245, 245, 245, 0.5);
  margin-top: 8px;
}

.loading-state,
.empty-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(245, 245, 245, 0.5);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 122, 0, 0.2);
  border-top-color: #ff7a00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}
.empty-state h3 {
  color: #f5f5f5;
  font-size: 1.4rem;
  margin-bottom: 8px;
}
.empty-state p {
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: #ff7a00;
  color: #0b0b0b;
  font-weight: 700;
  border-radius: 32px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: #ff9933;
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reservation-card {
  background: #161616;
  border: 1px solid rgba(245, 245, 245, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.reservation-card:hover {
  border-color: rgba(255, 122, 0, 0.3);
}

.resa-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  gap: 16px;
}

.resa-ref {
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  color: #ff7a00;
  font-weight: 700;
  margin-bottom: 4px;
}
.resa-event {
  font-size: 1rem;
  font-weight: 600;
  color: #f5f5f5;
  margin-bottom: 4px;
}
.resa-meta {
  font-size: 0.82rem;
  color: rgba(245, 245, 245, 0.5);
}

.resa-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 32px;
  border: 1px solid;
}

.resa-date {
  font-size: 0.78rem;
  color: rgba(245, 245, 245, 0.35);
}
.expand-icon {
  font-size: 0.7rem;
  color: rgba(245, 245, 245, 0.3);
}

.tickets-expand {
  padding: 0 24px 24px;
  border-top: 1px solid rgba(245, 245, 245, 0.06);
  margin-top: 0;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  padding-top: 20px;
}

.ticket-card {
  background: rgba(245, 245, 245, 0.04);
  border: 1px solid rgba(245, 245, 245, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: border-color 0.2s;
}

.ticket-card:hover {
  border-color: rgba(255, 122, 0, 0.3);
}

.ticket-qr {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: white;
}
.ticket-info {
  text-align: center;
}
.ticket-num {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f5f5f5;
  margin-bottom: 4px;
}
.ticket-ref {
  font-family: "Courier New", monospace;
  font-size: 0.68rem;
  color: rgba(245, 245, 245, 0.4);
  margin-bottom: 6px;
}
.ticket-status {
  font-size: 0.78rem;
  font-weight: 600;
}
</style>
