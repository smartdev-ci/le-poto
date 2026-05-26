<script setup lang="ts">
import CountdownTimer from './CountdownTimer.vue'

const eventDate = new Date('2026-06-28T22:00:00')
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero-bg">
      <img
        src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Concert Le Petit Poto"
        class="hero-img"
      />
      <div class="hero-overlay"></div>
      <div class="orb orb-orange"></div>
      <div class="orb orb-violet"></div>
    </div>

    <div class="hero-content container">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        Édition 5 — Le Grand Retour
      </div>

      <h1 class="hero-title">
        LE PAIYA<br />
        <span class="title-accent">COMMENCE ICI</span>
      </h1>

      <p class="hero-sub">
        La soirée la plus électrique d'Abidjan revient.<br />
        28 Juin 2026 · Palais de la Culture · Abidjan
      </p>

      <div class="hero-actions">
        <a href="#tickets" class="btn-primary btn-hero">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 5v14M5 12h14"/></svg>
          Réserver maintenant
        </a>
        <a href="#events" class="btn-secondary btn-hero">
          Voir l'édition
        </a>
      </div>

      <div class="hero-countdown">
        <p class="countdown-label">Prochain événement dans</p>
        <CountdownTimer :target-date="eventDate" />
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-num">2 000+</span>
          <span class="stat-label">participants</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">12</span>
          <span class="stat-label">DJs & artistes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">5</span>
          <span class="stat-label">éditions</span>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <span>Scroll</span>
      <div class="scroll-arrow">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M8 0v16M2 10l6 8 6-8" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: brightness(0.45);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(11,11,11,0.2) 0%,
    rgba(11,11,11,0.1) 40%,
    rgba(11,11,11,0.85) 85%,
    var(--black) 100%
  );
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  animation: float 8s ease-in-out infinite;
}

.orb-orange {
  width: 600px;
  height: 600px;
  background: var(--orange);
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.orb-violet {
  width: 500px;
  height: 500px;
  background: var(--violet);
  bottom: -100px;
  left: -150px;
  animation-delay: -4s;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding-top: 100px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 122, 0, 0.12);
  border: 1px solid rgba(255, 122, 0, 0.3);
  color: var(--orange);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: var(--radius-xl);
  animation: fadeInUp 0.6s ease both;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--orange);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 9rem);
  letter-spacing: 0.04em;
  line-height: 0.95;
  color: var(--white);
  animation: fadeInUp 0.7s ease 0.1s both;
}

.title-accent {
  color: var(--orange);
  display: block;
  -webkit-text-stroke: 2px var(--orange);
  text-stroke: 2px var(--orange);
}

.hero-sub {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  color: var(--white-dim);
  line-height: 1.6;
  max-width: 480px;
  animation: fadeInUp 0.7s ease 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 0.7s ease 0.3s both;
}

.btn-hero {
  font-size: 1rem;
  padding: 16px 32px;
}

.hero-countdown {
  margin-top: 8px;
  animation: fadeInUp 0.7s ease 0.4s both;
}

.countdown-label {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white-dim);
  margin-bottom: 12px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 16px;
  animation: fadeInUp 0.7s ease 0.5s both;
}

.stat { display: flex; flex-direction: column; gap: 2px; }
.stat-num {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.05em;
  color: var(--white);
}
.stat-label {
  font-size: 0.75rem;
  color: var(--white-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--white-dim);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  animation: float 3s ease-in-out infinite;
}

.scroll-arrow { color: var(--orange); }

@media (max-width: 768px) {
  .hero-content {
    align-items: center;
    text-align: center;
    padding-top: 120px;
  }
  .hero-title { font-size: clamp(3.5rem, 16vw, 6rem); }
  .hero-sub { text-align: center; }
  .hero-actions { justify-content: center; }
  .hero-stats { gap: 16px; }
  .stat-num { font-size: 1.6rem; }
  .orb-orange { width: 300px; height: 300px; }
  .orb-violet { width: 250px; height: 250px; }
  .scroll-indicator { display: none; }
}
</style>
