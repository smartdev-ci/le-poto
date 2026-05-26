<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 pt-24 pb-20">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-white text-center mb-8">Compte à rebours</h1>
      <div class="flex justify-center">
        <CountdownTimer :targetDate="new Date('2025-06-15T18:00:00')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountdownTimer from '@/components/CountdownTimer.vue';
</script>
