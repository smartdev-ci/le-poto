<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import EventsSection from './components/EventsSection.vue'
import TicketsSection from './components/TicketsSection.vue'
import GallerySection from './components/GallerySection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import FAQSection from './components/FAQSection.vue'
import FooterSection from './components/FooterSection.vue'
import LiveCounter from './components/LiveCounter.vue'
</script>

<template>
  <div class="app">
    <NavBar />
    <main>
      <HeroSection />
      <EventsSection />
      <TicketsSection />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
    </main>
    <FooterSection />
    <LiveCounter />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background: var(--black);
}
</style>
