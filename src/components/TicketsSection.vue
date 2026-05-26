<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@/composables/useQRCode'
import { createReservation, confirmPayment } from '@/services/reservationService'
import type { ReservationWithTickets, Ticket as TicketType } from '@/types/reservation'

const { generateQRUrl } = useQRCode()

interface TicketOffer {
  id: string
  name: string
  price: string
  priceNum: number
  currency: string
  description: string
  perks: string[]
  available: number
  total: number
}

const ticketOffer: TicketOffer = {
  id: 'standard',
  name: 'Billet Standard',
  price: '5 000',
  priceNum: 5000,
  currency: 'FCFA',
  description: 'L\'accès complet à l\'événement Le Petit Poto.',
  perks: ['Accès à l\'événement', '1 boisson offerte', 'Goodies exclusif'],
  available: 87,
  total: 500,
}

const paymentMethods = [
  { id: 'orange', label: 'Orange Money', color: '#ff6600' },
  { id: 'mtn', label: 'MTN Money', color: '#ffcc00' },
  { id: 'wave', label: 'Wave', color: '#1da1f2' },
  { id: 'card', label: 'Carte bancaire', color: '#6b7280' },
]

const showModal = ref(false)
const quantity = ref(1)
const selectedPayment = ref('orange')
const step = ref<'select' | 'pay' | 'confirm'>('select')
const phone = ref('')
const loading = ref(false)
const error = ref('')

const buyerName = ref('')
const buyerEmail = ref('')
const buyerPhone = ref('')

const reservation = ref<ReservationWithTickets | null>(null)

const qrUrls = computed(() => {
  if (!reservation.value?.tickets) return []
  return reservation.value.tickets.map(ticket =>
    generateQRUrl(ticket.qr_data, { size: 200 })
  )
})

function openModal() {
  quantity.value = 1
  step.value = 'select'
  phone.value = ''
  buyerName.value = ''
  buyerEmail.value = ''
  buyerPhone.value = ''
  loading.value = false
  error.value = ''
  reservation.value = null
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

function proceedToPay() {
  error.value = ''
  if (!buyerName.value || !buyerEmail.value || !buyerPhone.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }
  if (!buyerEmail.value.includes('@')) {
    error.value = 'Veuillez entrer une adresse email valide'
    return
  }
  step.value = 'pay'
}

async function processPayment() {
  loading.value = true
  error.value = ''

  try {
    // Create reservation with individual tickets in database
    reservation.value = await createReservation({
      buyer_name: buyerName.value,
      buyer_email: buyerEmail.value,
      buyer_phone: buyerPhone.value,
      quantity: quantity.value,
      total_price: ticketOffer.priceNum * quantity.value,
      payment_method: selectedPayment.value
    })

    // Simulate payment confirmation
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Confirm payment
    await confirmPayment(reservation.value.reference)

    step.value = 'confirm'
  } catch (err) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    console.error('Payment error:', err)
  } finally {
    loading.value = false
  }
}

function totalPrice() {
  return ticketOffer.priceNum * quantity.value
}

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR')
}

function downloadAllTickets() {
  if (!reservation.value?.tickets) return

  reservation.value.tickets.forEach((ticket, index) => {
    setTimeout(() => downloadSingleTicket(ticket, index), index * 500)
  })
}

function downloadSingleTicket(ticket: TicketType, index: number) {
  if (!reservation.value) return

  const qrUrl = qrUrls.value[index]

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ticket Le Petit Poto - ${ticket.reference}</title>
  <style>
    body { font-family: 'Courier New', monospace; background: #0B0B0B; color: #F5F5F5; padding: 40px; text-align: center; }
    .ticket { background: #161616; border: 2px solid #FF7A00; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; }
    .logo { font-size: 3rem; font-weight: bold; letter-spacing: 0.1em; margin-bottom: 8px; }
    .logo-part1 { color: #F5F5F5; }
    .logo-part2 { color: #FF7A00; }
    .ticket-badge { display: inline-block; background: #FF7A00; color: #000; padding: 8px 20px; border-radius: 8px; font-weight: bold; font-size: 0.9rem; margin: 10px 0; }
    .ref { color: #FF7A00; font-size: 1.5rem; font-weight: bold; margin: 20px 0; font-family: 'Courier New'; }
    .qr-section { background: #fff; display: inline-block; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .qr-section img { width: 200px; height: 200px; }
    .info { text-align: left; margin: 20px 0; line-height: 1.8; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
    .info-label { color: #888; }
    .info-value { color: #F5F5F5; font-weight: bold; }
    .footer { margin-top: 30px; color: #666; font-size: 0.8rem; }
    .barcode { font-size: 0.7rem; letter-spacing: 3px; color: #FF7A00; margin-top: 20px; }
    .ticket-number { color: #7B2EFF; font-size: 1.2rem; margin-top: -10px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="logo">
      <span class="logo-part1">LE PETIT</span>
      <span class="logo-part2">POTO</span>
    </div>
    <div style="color: #7B2EFF; font-size: 0.9rem; letter-spacing: 0.15em;">ÉDITION 5 — LE GRAND RETOUR</div>

    <div class="ticket-badge">TICKET ${ticket.ticket_number} / ${reservation.value.quantity}</div>

    <div class="ref">${ticket.reference}</div>

    <div class="qr-section">
      <img src="${qrUrl}" alt="QR Code" />
    </div>

    <div class="info">
      <div class="info-row">
        <span class="info-label">Événement</span>
        <span class="info-value">Le Petit Poto</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date</span>
        <span class="info-value">28 Juin 2026 - 22h00</span>
      </div>
      <div class="info-row">
        <span class="info-label">Lieu</span>
        <span class="info-value">Palais de la Culture, Abidjan</span>
      </div>
      <div class="info-row">
        <span class="info-label">Participant</span>
        <span class="info-value">${buyerName.value}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">${buyerEmail.value}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Statut</span>
        <span class="info-value" style="color: #22c55e;">CONFIRMÉ</span>
      </div>
    </div>

    <div class="barcode">||||| ${ticket.reference} |||||</div>

    <div class="footer">
      Présentez ce ticket à l'entrée avec le QR code ci-dessus.<br/>
      Ticket ${ticket.ticket_number} sur ${reservation.value.quantity}. Non remboursable.
    </div>
  </div>
</body>
</html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ticket-le-petit-poto-${ticket.reference}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section id="tickets" class="tickets-section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Billetterie</span>
        <h2 class="section-title">Réserve ton<br /><span class="text-orange">billet</span></h2>
        <p class="section-desc">Paiement rapide via Orange Money, MTN, Wave ou carte bancaire.</p>
      </div>

      <div class="ticket-single">
        <div class="ticket-card">
          <div class="ticket-visual">
            <div class="ticket-price-display">
              <span class="price-big">{{ ticketOffer.price }}</span>
              <span class="price-currency">{{ ticketOffer.currency }}</span>
            </div>
          </div>

          <div class="ticket-body">
            <h3 class="ticket-title">{{ ticketOffer.name }}</h3>
            <p class="ticket-desc">{{ ticketOffer.description }}</p>

            <div class="ticket-availability">
              <div class="avail-bar">
                <div
                  class="avail-fill"
                  :style="{ width: `${((ticketOffer.total - ticketOffer.available) / ticketOffer.total) * 100}%` }"
                ></div>
              </div>
              <span class="avail-text">
                <strong>{{ ticketOffer.available }}</strong> places restantes sur {{ ticketOffer.total }}
              </span>
            </div>

            <ul class="ticket-perks">
              <li v-for="perk in ticketOffer.perks" :key="perk">
                <i class="fas fa-check" style="color: var(--orange);"></i>
                {{ perk }}
              </li>
            </ul>

            <button class="ticket-cta" @click="openModal">
              <i class="fas fa-ticket-alt"></i>
              Acheter ce billet
            </button>
          </div>
        </div>
      </div>

      <div class="payment-icons">
        <span class="payment-label">Paiements acceptés</span>
        <div class="payment-list">
          <span v-for="pm in paymentMethods" :key="pm.id" class="payment-item">
            <i class="fas fa-mobile-alt"></i>
            {{ pm.label }}
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <button class="modal-close" @click="closeModal" aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>

        <!-- Step 1: Infos acheteur -->
        <div v-if="step === 'select'" class="modal-step">
          <h3 class="modal-title">Acheter {{ quantity }} billet{{ quantity > 1 ? 's' : '' }}</h3>
          <p class="modal-subtitle">{{ ticketOffer.name }} — {{ formatPrice(totalPrice()) }} FCFA</p>

          <div class="form-group">
            <label class="form-label">Quantité</label>
            <div class="qty-control">
              <button @click="quantity = Math.max(1, quantity - 1)" class="qty-btn">
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty-num">{{ quantity }}</span>
              <button @click="quantity = Math.min(5, quantity + 1)" class="qty-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Nom complet</label>
            <input v-model="buyerName" class="form-input" type="text" placeholder="Votre nom complet" />
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="buyerEmail" class="form-input" type="email" placeholder="votre@email.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Téléphone</label>
            <input v-model="buyerPhone" class="form-input" type="tel" placeholder="+225 XX XX XX XX XX" />
          </div>

          <div v-if="error" class="error-msg">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <div class="modal-total">
            <span>Total à payer</span>
            <span class="total-price">{{ formatPrice(totalPrice()) }} FCFA</span>
          </div>

          <button class="btn-primary modal-cta" @click="proceedToPay">
            Continuer vers le paiement
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <!-- Step 2: Paiement -->
        <div v-else-if="step === 'pay'" class="modal-step">
          <h3 class="modal-title">Paiement</h3>
          <p class="modal-subtitle">{{ quantity }}x {{ ticketOffer.name }} — {{ formatPrice(totalPrice()) }} FCFA</p>

          <div class="form-group">
            <label class="form-label">Mode de paiement</label>
            <div class="pm-grid">
              <button
                v-for="pm in paymentMethods"
                :key="pm.id"
                :class="['pm-btn', { selected: selectedPayment === pm.id }]"
                :style="selectedPayment === pm.id ? { borderColor: pm.color, background: pm.color + '15' } : {}"
                @click="selectedPayment = pm.id"
              >
                <i class="fas fa-mobile-alt"></i>
                <span>{{ pm.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="selectedPayment !== 'card'" class="form-group">
            <label class="form-label">Numéro {{ paymentMethods.find(p => p.id === selectedPayment)?.label }}</label>
            <input
              v-model="phone"
              class="form-input"
              type="tel"
              placeholder="+225 07 XX XX XX XX"
            />
          </div>

          <div v-else class="form-group">
            <label class="form-label">Numéro de carte</label>
            <input
              class="form-input"
              type="text"
              placeholder="4242 4242 4242 4242"
            />
          </div>

          <div v-if="error" class="error-msg">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <button class="btn-primary modal-cta" :disabled="loading" @click="processPayment">
            <template v-if="!loading">
              Payer {{ formatPrice(totalPrice()) }} FCFA
              <i class="fas fa-lock"></i>
            </template>
            <template v-else>
              <i class="fas fa-spinner fa-spin"></i>
              Traitement en cours...
            </template>
          </button>
        </div>

        <!-- Step 3: Confirmation + Multiple Tickets -->
        <div v-else class="modal-step confirm-step">
          <div class="confirm-icon">
            <i class="fas fa-check"></i>
          </div>
          <h3 class="modal-title">Réservation confirmée !</h3>
          <p class="modal-subtitle">{{ quantity }} billet{{ quantity > 1 ? 's' : '' }} envoyé{{ quantity > 1 ? 's' : '' }} par email.</p>

          <div class="tickets-summary">
            <p class="summary-title">Réservation {{ reservation?.reference }}</p>
            <p class="summary-buyer">{{ buyerName }} — {{ buyerEmail }}</p>
          </div>

          <div class="tickets-grid">
            <div
              v-for="(ticket, index) in reservation?.tickets"
              :key="ticket.id"
              class="ticket-item"
            >
              <img :src="qrUrls[index]" :alt="'QR Code ' + ticket.reference" class="ticket-qr" />
              <div class="ticket-meta">
                <span class="ticket-badge">Ticket {{ ticket.ticket_number }}</span>
                <span class="ticket-ref-small">{{ ticket.reference }}</span>
              </div>
              <button class="download-single-btn" @click="downloadSingleTicket(ticket, index)">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>

          <div class="confirm-actions">
            <button class="btn-primary modal-cta" @click="downloadAllTickets">
              <i class="fas fa-download"></i>
              Télécharger {{ quantity }} billet{{ quantity > 1 ? 's' : '' }}
            </button>
            <button class="btn-secondary modal-cta" @click="closeModal">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.tickets-section {
  padding: 100px 0;
  background: linear-gradient(180deg, var(--black) 0%, var(--black-soft) 50%, var(--black) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-desc {
  color: var(--white-dim);
  max-width: 460px;
  margin: 16px auto 0;
}

.ticket-single {
  display: flex;
  justify-content: center;
}

.ticket-card {
  position: relative;
  background: var(--black-card);
  border: 2px solid var(--orange);
  border-radius: var(--radius-lg);
  overflow: hidden;
  width: 100%;
  max-width: 480px;
}

.ticket-visual {
  background: linear-gradient(135deg, var(--orange) 0%, #ff9933 100%);
  padding: 40px;
  text-align: center;
}

.ticket-price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.price-big {
  font-family: var(--font-display);
  font-size: 5rem;
  letter-spacing: 0.04em;
  color: var(--black);
  line-height: 1;
}

.price-currency {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--black);
  opacity: 0.8;
}

.ticket-body {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ticket-title {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.04em;
  color: var(--white);
}

.ticket-desc {
  font-size: 0.95rem;
  color: var(--white-dim);
  line-height: 1.6;
}

.ticket-availability {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avail-bar {
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.avail-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--violet));
  border-radius: 3px;
  transition: width 1s ease;
}

.avail-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--orange);
}

.ticket-perks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-perks li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.92rem;
  color: var(--white-dim);
}

.ticket-cta {
  width: 100%;
  padding: 18px;
  border-radius: var(--radius-xl);
  font-weight: 700;
  font-size: 1rem;
  background: var(--orange);
  color: var(--black);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: var(--transition);
  cursor: pointer;
}

.ticket-cta:hover {
  background: #ff9933;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--orange-glow);
}

.payment-icons {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
  margin-top: 48px;
  flex-wrap: wrap;
}

.payment-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--white-dim);
}

.payment-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: var(--radius-xl);
  background: var(--white-faint);
  border: 1px solid var(--border);
  color: var(--white-dim);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  position: relative;
  background: var(--black-card);
  border: 1px solid var(--border-active);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  padding: 32px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  animation: fadeInUp 0.3s ease both;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--white-faint);
  border: none;
  color: var(--white);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition);
}

.modal-close:hover { background: rgba(255,255,255,0.15); }

.modal-step { display: flex; flex-direction: column; gap: 20px; }

.modal-title {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.04em;
  color: var(--white);
}

.modal-subtitle { font-size: 0.95rem; color: var(--white-dim); }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--white-dim);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  background: var(--white-faint);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color var(--transition);
}

.form-input:focus { border-color: var(--orange); }
.form-input::placeholder { color: rgba(245,245,245,0.3); }

.error-msg {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: var(--radius-md);
  color: #f87171;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white-faint);
  border: 1px solid var(--border);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.qty-btn:hover {
  background: var(--orange);
  color: var(--black);
  border-color: var(--orange);
}

.qty-num {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--white);
  min-width: 60px;
  text-align: center;
}

.modal-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--white-faint);
  border-radius: var(--radius-md);
  font-weight: 600;
  color: var(--white-dim);
}

.total-price {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.04em;
  color: var(--orange);
}

.modal-cta {
  width: 100%;
  justify-content: center;
  font-size: 1rem;
  padding: 16px;
  display: flex;
  gap: 10px;
}

.pm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.pm-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--white-faint);
  border: 2px solid var(--border);
  color: var(--white-dim);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.pm-btn:hover { border-color: var(--orange); color: var(--white); }
.pm-btn.selected { border-color: var(--orange); color: var(--white); }

/* Confirmation */
.confirm-step { align-items: center; text-align: center; }

.confirm-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--success);
  animation: float 3s ease-in-out infinite;
}

.tickets-summary {
  padding: 16px;
  background: var(--white-faint);
  border-radius: var(--radius-md);
  width: 100%;
}

.summary-title {
  font-weight: 700;
  color: var(--orange);
  font-size: 1.1rem;
}

.summary-buyer {
  font-size: 0.85rem;
  color: var(--white-dim);
  margin-top: 4px;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  width: 100%;
  margin: 16px 0;
}

.ticket-item {
  position: relative;
  background: var(--white-faint);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
}

.ticket-item:hover {
  border-color: var(--orange);
}

.ticket-qr {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ticket-badge {
  background: var(--orange);
  color: var(--black);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.ticket-ref-small {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: var(--white-dim);
}

.download-single-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--white-faint);
  border: 1px solid var(--border);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: var(--transition);
}

.download-single-btn:hover {
  background: var(--orange);
  color: var(--black);
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

@media (max-width: 600px) {
  .modal { padding: 24px; }
  .tickets-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
