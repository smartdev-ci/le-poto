<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Événements', href: '#events' },
  { label: 'Billetterie', href: '#tickets' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 60
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav :class="['navbar', { scrolled }]">
    <div class="container nav-inner">
      <a href="#hero" class="nav-logo" @click="closeMenu">
        <span class="logo-text">LE PETIT</span>
        <span class="logo-accent">POTO</span>
      </a>

      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.label">
          <a :href="link.href">{{ link.label }}</a>
        </li>
      </ul>

      <a href="#tickets" class="btn-primary nav-cta">
        Réserver
      </a>

      <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <ul>
        <li v-for="link in navLinks" :key="link.label">
          <a :href="link.href" @click="closeMenu">{{ link.label }}</a>
        </li>
        <li>
          <a href="#tickets" class="btn-primary mobile-cta" @click="closeMenu">Réserver maintenant</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: var(--transition);
}

.navbar.scrolled {
  background: rgba(11, 11, 11, 0.95);
  backdrop-filter: blur(20px);
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 32px rgba(0,0,0,0.4);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-logo {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.1em;
  color: var(--white);
}

.logo-accent {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.1em;
  color: var(--orange);
}

.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin-left: auto;
}

.nav-links a {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--white-dim);
  transition: color var(--transition);
  letter-spacing: 0.02em;
}

.nav-links a:hover {
  color: var(--white);
}

.nav-cta {
  font-size: 0.85rem;
  padding: 10px 22px;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--white);
  border-radius: 2px;
  transition: var(--transition);
  transform-origin: center;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobile-menu {
  display: none;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s ease;
  background: rgba(11, 11, 11, 0.98);
  backdrop-filter: blur(20px);
}

.mobile-menu.open {
  max-height: 400px;
}

.mobile-menu ul {
  list-style: none;
  padding: 20px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-menu a {
  display: block;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--white-dim);
  border-bottom: 1px solid var(--border);
  transition: color var(--transition);
}

.mobile-menu a:hover { color: var(--white); }

.mobile-cta {
  margin-top: 16px;
  text-align: center;
  border: none !important;
  justify-content: center;
}

@media (max-width: 768px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: block; }
}
</style>
