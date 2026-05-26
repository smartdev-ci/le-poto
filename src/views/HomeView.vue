<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 overflow-hidden">
      <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Le Petit <span class="text-orange-500">Poto</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            L'événement incontournable de l'année ! Rejoignez-nous pour une expérience unique.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/tickets" 
              class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Réserver mon billet - 5000 FCFA
            </router-link>
            <a 
              href="#event-details" 
              class="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-full transition-all"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="py-16 bg-gray-900/50">
      <CountdownTimer />
    </section>

    <!-- Event Details -->
    <section id="event-details" class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h2 class="text-4xl font-bold text-white">Un événement exceptionnel</h2>
            <p class="text-gray-300 text-lg leading-relaxed">
              Préparez-vous à vivre un moment inoubliable. Musique, danse, rencontres et bonnes vibes sont au rendez-vous.
            </p>
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-gray-300">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Samedi 15 Juin 2025 - 18h00</span>
              </div>
              <div class="flex items-center gap-4 text-gray-300">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Palais des Congrès, Yaoundé</span>
              </div>
              <div class="flex items-center gap-4 text-gray-300">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Billet unique : 5000 FCFA</span>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl shadow-2xl shadow-purple-500/30 overflow-hidden">
              <img src="/event-placeholder.jpg" alt="Événement" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-32 h-32 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-gray-900/50">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-white text-center mb-16">Pourquoi ne pas manquer ça ?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-800/50 p-8 rounded-2xl border border-purple-500/20 hover:border-orange-500/50 transition-all">
            <div class="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Line-up Exceptionnel</h3>
            <p class="text-gray-400">Les meilleurs artistes de la scène locale et internationale réunis pour une nuit mémorable.</p>
          </div>
          <div class="bg-gray-800/50 p-8 rounded-2xl border border-purple-500/20 hover:border-orange-500/50 transition-all">
            <div class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Ambiance Garantie</h3>
            <p class="text-gray-400">Une production de qualité professionnelle avec son, lumière et effets spéciaux.</p>
          </div>
          <div class="bg-gray-800/50 p-8 rounded-2xl border border-purple-500/20 hover:border-orange-500/50 transition-all">
            <div class="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Expérience Unique</h3>
            <p class="text-gray-400">Plus qu'un concert, un véritable moment de partage et de célébration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-8">Prêt à vivre l'expérience ?</h2>
        <p class="text-gray-300 mb-8 max-w-xl mx-auto">
          Les places sont limitées. Réservez dès maintenant votre billet pour garantir votre accès.
        </p>
        <router-link 
          to="/tickets" 
          class="inline-block bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
        >
          Acheter mon billet - 5000 FCFA
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CountdownTimer from '@/components/CountdownTimer.vue';
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
