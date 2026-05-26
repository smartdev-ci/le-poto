<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 pt-24 pb-20">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          Achat de billet
        </h1>
        <p class="text-gray-300">Le Petit Poto - 5000 FCFA</p>
      </div>

      <!-- Purchase Form -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Guest or Login Toggle -->
          <div class="flex gap-4 mb-6">
            <button
              type="button"
              @click="isGuest = true"
              :class="[
                'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
                isGuest 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              Commander en invité
            </button>
            <button
              type="button"
              @click="isGuest = false"
              :class="[
                'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
                !isGuest 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              Se connecter
            </button>
          </div>

          <!-- Guest Fields -->
          <div v-if="isGuest" class="space-y-4">
            <div>
              <label class="block text-gray-300 text-sm font-semibold mb-2">
                Nom complet *
              </label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label class="block text-gray-300 text-sm font-semibold mb-2">
                Email *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label class="block text-gray-300 text-sm font-semibold mb-2">
                Téléphone *
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>

          <!-- Logged in user info -->
          <div v-else class="bg-gray-700/50 rounded-lg p-4 mb-4">
            <p class="text-gray-300 text-sm">
              Connectez-vous pour acheter votre billet. Vos informations seront automatiquement remplies.
            </p>
            <router-link
              to="/login"
              class="inline-block mt-3 text-orange-500 hover:text-orange-400 font-semibold"
            >
              Aller à la connexion →
            </router-link>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-2">
              Nombre de billets
            </label>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="decrementQuantity"
                class="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xl font-bold transition-colors"
              >
                -
              </button>
              <span class="text-2xl font-bold text-white w-12 text-center">{{ quantity }}</span>
              <button
                type="button"
                @click="incrementQuantity"
                class="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>
            <p class="text-gray-400 text-sm mt-2">Maximum 10 billets par commande</p>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-700/30 rounded-lg p-6 border border-purple-500/20">
            <h3 class="text-lg font-bold text-white mb-4">Résumé de la commande</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-gray-300">
                <span>{{ quantity }} billet(s) × 5000 FCFA</span>
                <span>{{ quantity * 5000 }} FCFA</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Frais de service</span>
                <span>Gratuit</span>
              </div>
              <div class="border-t border-gray-600 pt-2 flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span class="text-orange-500">{{ quantity * 5000 }} FCFA</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-gray-300 text-sm font-semibold mb-3">
              Mode de paiement
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="paymentMethod = 'mtn'"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-center',
                  paymentMethod === 'mtn'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                ]"
              >
                <div class="font-bold" :class="paymentMethod === 'mtn' ? 'text-yellow-500' : 'text-white'">
                  MTN Mobile Money
                </div>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'orange'"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-center',
                  paymentMethod === 'orange'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                ]"
              >
                <div class="font-bold" :class="paymentMethod === 'orange' ? 'text-orange-500' : 'text-white'">
                  Orange Money
                </div>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || (!isGuest && !authStore.isAuthenticated)"
            class="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
          >
            <span v-if="loading">Traitement en cours...</span>
            <span v-else>Payer {{ quantity * 5000 }} FCFA</span>
          </button>

          <!-- Terms -->
          <p class="text-xs text-gray-400 text-center">
            En cliquant sur "Payer", vous acceptez nos conditions générales de vente.
            Les billets sont nominatifs et non remboursables.
          </p>
        </form>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-green-500/30">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Commande confirmée !</h2>
            <p class="text-gray-300 mb-6">
              Votre e-ticket avec QR code a été envoyé à {{ form.email }}. Présentez-le à l'entrée de l'événement.
            </p>
            <div class="space-y-3">
              <router-link
                to="/my-orders"
                class="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Voir mes commandes
              </router-link>
              <router-link
                to="/"
                class="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Retour à l'accueil
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isGuest = ref(true)
const quantity = ref(1)
const paymentMethod = ref<'mtn' | 'orange'>('mtn')
const loading = ref(false)
const showSuccess = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  phone: ''
})

function incrementQuantity() {
  if (quantity.value < 10) quantity.value++
}

function decrementQuantity() {
  if (quantity.value > 1) quantity.value--
}

async function handleSubmit() {
  loading.value = true
  
  // Simuler le traitement de paiement
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Ici, intégrer l'API de paiement Mobile Money
  // Après succès, envoyer l'e-ticket par email
  
  loading.value = false
  showSuccess.value = true
}
</script>
