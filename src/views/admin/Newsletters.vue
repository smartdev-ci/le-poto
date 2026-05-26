<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Campagnes Marketing</h1>

    <!-- Stats Overview -->
    <div class="grid md:grid-cols-4 gap-4">
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Abonnés newsletter</p>
        <p class="text-2xl font-bold text-white">1,234</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Campagnes envoyées</p>
        <p class="text-2xl font-bold text-white">12</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Taux d'ouverture moyen</p>
        <p class="text-2xl font-bold text-orange-500">42.5%</p>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
        <p class="text-gray-400 text-sm mb-1">Taux de clic moyen</p>
        <p class="text-2xl font-bold text-green-500">18.3%</p>
      </div>
    </div>

    <!-- Create Campaign -->
    <div class="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
      <h2 class="text-xl font-semibold text-white mb-4">Nouvelle campagne</h2>
      <form @submit.prevent="createCampaign" class="space-y-4">
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2">Titre de la campagne</label>
          <input
            v-model="newCampaign.title"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            placeholder="Ex: Promo Early Bird"
          />
        </div>
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2">Sujet de l'email</label>
          <input
            v-model="newCampaign.subject"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            placeholder="🎉 Offre spéciale pour Le Petit Poto !"
          />
        </div>
        <div>
          <label class="block text-gray-300 text-sm font-semibold mb-2">Contenu</label>
          <textarea
            v-model="newCampaign.content"
            rows="6"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
            placeholder="Rédigez votre message ici..."
          ></textarea>
        </div>
        <div class="flex gap-4">
          <button
            type="submit"
            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Créer la campagne
          </button>
          <button
            type="button"
            class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Aperçu
          </button>
        </div>
      </form>
    </div>

    <!-- Campaigns List -->
    <div class="bg-gray-800/50 rounded-lg border border-purple-500/20 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">Campagnes précédentes</h2>
      </div>
      <table class="w-full">
        <thead class="bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Campagne</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Destinataires</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ouvertures</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Clics</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="campaign in campaigns" :key="campaign.id" class="hover:bg-gray-700/30">
            <td class="px-6 py-4">
              <p class="text-white font-semibold">{{ campaign.title }}</p>
              <p class="text-gray-400 text-sm">{{ campaign.subject }}</p>
            </td>
            <td class="px-6 py-4 text-gray-300">{{ formatDate(campaign.date) }}</td>
            <td class="px-6 py-4 text-gray-300">{{ campaign.recipients.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span class="text-green-400 font-semibold">{{ campaign.opens }}%</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-blue-400 font-semibold">{{ campaign.clicks }}%</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button class="text-gray-400 hover:text-white transition-colors" title="Voir">👁️</button>
                <button class="text-gray-400 hover:text-orange-500 transition-colors" title="Dupliquer">📋</button>
                <button class="text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Promo Codes -->
    <div class="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-white">Codes promotionnels</h2>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouveau code
        </button>
      </div>
      <div class="grid gap-3">
        <div v-for="code in promoCodes" :key="code.id" class="flex justify-between items-center bg-gray-700/30 rounded-lg p-4">
          <div>
            <p class="text-white font-bold text-lg">{{ code.code }}</p>
            <p class="text-gray-400 text-sm">{{ code.description }} - {{ code.discount }}% de réduction</p>
          </div>
          <div class="flex items-center gap-4">
            <span :class="code.active ? 'text-green-400' : 'text-red-400'" class="text-sm font-semibold">
              {{ code.active ? 'Actif' : 'Inactif' }}
            </span>
            <button class="text-gray-400 hover:text-white transition-colors">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const newCampaign = reactive({
  title: '',
  subject: '',
  content: ''
})

const campaigns = ref([
  {
    id: '1',
    title: 'Lancement officiel',
    subject: '🎉 Le Petit Poto est de retour !',
    date: '2025-01-15',
    recipients: 1200,
    opens: 45,
    clicks: 22
  },
  {
    id: '2',
    title: 'Rappel billetterie',
    subject: '⏰ Plus que quelques jours pour réserver',
    date: '2025-01-10',
    recipients: 980,
    opens: 38,
    clicks: 15
  },
  {
    id: '3',
    title: 'Annonce artistes',
    subject: '🎤 Découvrez les artistes confirmés',
    date: '2025-01-05',
    recipients: 1100,
    opens: 52,
    clicks: 28
  }
])

const promoCodes = ref([
  { id: '1', code: 'EARLYBIRD', description: 'Réduction early bird', discount: 20, active: true },
  { id: '2', code: 'GROUP10', description: 'Promo groupe 10+ billets', discount: 15, active: true },
  { id: '3', code: 'VIP2025', description: 'Offre VIP exclusive', discount: 30, active: false }
])

function createCampaign() {
  // Logique de création de campagne
  console.log('Nouvelle campagne:', newCampaign)
  alert('Campagne créée avec succès !')
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
