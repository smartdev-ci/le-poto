<script setup lang="ts">
const testimonials = [
  {
    id: 1,
    text: "Le Petit Poto c'est une autre dimension. L'ambiance, les artistes, les lumières... J'y étais à l'édition 4 et j'ai déjà réservé pour la 5. C'est obligatoire !",
    name: 'Kouamé A.',
    handle: '@kouame.abj',
    platform: 'instagram',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    text: "Meilleure soirée de l'année sans discussion. Le DJ Myst a détruit la place. La section VIP valait chaque franc. Je recommande les yeux fermés.",
    name: 'Adjoa M.',
    handle: '@adjoa.vibes',
    platform: 'tiktok',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    text: "Prise de ticket sur le site en 2 minutes, ticket QR reçu sur WhatsApp immédiatement. L'expérience commence déjà avant la soirée. 10/10",
    name: 'Franck K.',
    handle: '@franckk_ci',
    platform: 'twitter',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 4,
    text: "Le Petit Poto a redéfini ce que c'est une soirée à Abidjan. La mise en scène, le son, tout était parfait. La jeunesse ivoirienne méritait ça.",
    name: 'Naïla B.',
    handle: '@nailab_abi',
    platform: 'instagram',
    avatar: 'https://images.pexels.com/photos/1391499/pexels-photo-1391499.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
]

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  tiktok: '#ff0050',
  twitter: '#1DA1F2',
}
</script>

<template>
  <section class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Témoignages</span>
        <h2 class="section-title">Ils y étaient,<br /><span class="text-orange">ils en parlent</span></h2>
      </div>

      <div class="testimonials-grid">
        <article v-for="t in testimonials" :key="t.id" class="testimonial-card">
          <div class="testimonial-quote">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" class="quote-icon">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <p class="testimonial-text">{{ t.text }}</p>
          <div class="testimonial-author">
            <img :src="t.avatar" :alt="t.name" class="author-avatar" />
            <div class="author-info">
              <span class="author-name">{{ t.name }}</span>
              <span class="author-handle" :style="{ color: platformColors[t.platform] }">{{ t.handle }}</span>
            </div>
            <span class="platform-badge" :style="{ background: `${platformColors[t.platform]}20`, border: `1px solid ${platformColors[t.platform]}40`, color: platformColors[t.platform] }">
              {{ t.platform }}
            </span>
          </div>
        </article>
      </div>

      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-big">4.9/5</span>
          <span class="stat-small">Note moyenne</span>
        </div>
        <div class="stat-item">
          <span class="stat-big">+1 200</span>
          <span class="stat-small">Avis positifs</span>
        </div>
        <div class="stat-item">
          <span class="stat-big">98%</span>
          <span class="stat-small">Reviendraient</span>
        </div>
        <div class="stat-item">
          <span class="stat-big">5</span>
          <span class="stat-small">Éditions vendues out</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section {
  padding: 100px 0;
  background: var(--black);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.testimonial-card {
  background: var(--black-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: var(--transition);
}

.testimonial-card:hover {
  border-color: var(--border-active);
  transform: translateY(-3px);
}

.testimonial-quote { color: var(--orange); opacity: 0.4; }

.testimonial-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--white-dim);
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-active);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.author-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--white);
}

.author-handle {
  font-size: 0.8rem;
  font-weight: 500;
}

.platform-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-xl);
}

.stats-banner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 56px;
}

.stat-item {
  background: var(--black-card);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.stat-big {
  font-family: var(--font-display);
  font-size: 2.4rem;
  letter-spacing: 0.04em;
  color: var(--orange);
}

.stat-small {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--white-dim);
}

@media (max-width: 768px) {
  .testimonials-section { padding: 72px 0; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .stats-banner { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .stats-banner { grid-template-columns: 1fr 1fr; }
}
</style>
