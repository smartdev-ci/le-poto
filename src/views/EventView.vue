<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 pt-24 pb-20">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- En-tête de l'événement -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
          Le Grand Concert 2025
        </h1>
        <p class="text-xl text-purple-200 mb-6">
          Un événement unique à ne pas manquer !
        </p>
        <div class="flex justify-center items-center gap-4 text-gray-300">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            15 Juin 2025
          </span>
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            Palais des Congrès, Yaoundé
          </span>
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            18:00
          </span>
        </div>
      </div>

      <!-- Compte à rebours -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-purple-500/30">
        <h2 class="text-2xl font-bold text-white text-center mb-6">Compte à rebours</h2>
        <div class="flex justify-center">
          <CountdownTimer :targetDate="new Date('2025-06-15T18:00:00')" />
        </div>
      </div>

      <!-- Description de l'événement -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h3 class="text-2xl font-bold text-white mb-4">À propos de l'événement</h3>
          <p class="text-gray-300 leading-relaxed">
            Rejoignez-nous pour le plus grand concert de l'année ! Une soirée exceptionnelle 
            avec des artistes de renommée internationale, une ambiance électrique et des moments 
            inoubliables. Que vous soyez fan de musique ou simplement à la recherche d'une 
            expérience unique, cet événement est fait pour vous.
          </p>
          <p class="text-gray-300 leading-relaxed mt-4">
            Au programme : concerts live, DJ sets, espaces de restauration, zones VIP et bien plus encore !
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h3 class="text-2xl font-bold text-white mb-4">Informations pratiques</h3>
          <ul class="space-y-3 text-gray-300">
            <li class="flex items-start">
              <svg class="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Places limitées - Réservez dès maintenant</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Prix unique : 5000 FCFA</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Paiement sécurisé via Mobile Money</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>E-ticket envoyé par email avec QR code</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Accès gratuit aux boissons pour les 100 premiers</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Section d'achat -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl p-8 mb-8">
          <h3 class="text-3xl font-bold text-white mb-2">Réservez votre place</h3>
          <p class="text-purple-100 mb-6">Ne manquez pas cette opportunité unique !</p>
          <div class="text-4xl font-bold text-white mb-6">5000 FCFA</div>
          <router-link
            to="/purchase"
            class="inline-block bg-white text-purple-900 font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Acheter mon billet
          </router-link>
        </div>

        <p class="text-gray-400 text-sm">
          Achat possible sans compte • Paiement sécurisé • E-ticket immédiat
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountdownTimer from '@/components/CountdownTimer.vue';
</script>
