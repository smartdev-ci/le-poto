<script setup lang="ts">
const events = [
  {
    id: 1,
    edition: 'Édition 5',
    title: 'Le Grand Retour',
    date: '28 Juin 2026',
    time: '22h00 - 06h00',
    venue: 'Palais de la Culture',
    city: 'Abidjan, Côte d\'Ivoire',
    artists: ['DJ Myst', 'Kerozen', 'Liricson', 'DJ Lewis'],
    ticketsLeft: 87,
    totalTickets: 500,
    status: 'upcoming',
    img: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'À partir de 5 000 FCFA',
    tags: ['Afrobeats', 'Drill', 'Amapiano'],
  },
  {
    id: 2,
    edition: 'Édition 4',
    title: 'Nuit des Champions',
    date: '14 Déc 2025',
    time: '22h00 - 06h00',
    venue: 'Sofitel Abidjan Hôtel Ivoire',
    city: 'Abidjan, Côte d\'Ivoire',
    artists: ['DJ Myst', 'Serge Beynaud', 'Nash', 'DJ Zeus'],
    ticketsLeft: 0,
    totalTickets: 400,
    status: 'past',
    img: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Terminé',
    tags: ['Coupé-décalé', 'Afrobeats', 'Hip-hop'],
  },
  {
    id: 3,
    edition: 'Édition 3',
    title: 'Vibes & Paiya',
    date: '15 Juin 2025',
    time: '22h00 - 06h00',
    venue: 'La Villa des Lumières',
    city: 'Abidjan, Côte d\'Ivoire',
    artists: ['DJ Myst', 'Ariel Sheney', 'Dj Black', 'Master KG'],
    ticketsLeft: 0,
    totalTickets: 350,
    status: 'past',
    img: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Terminé',
    tags: ['Afrobeats', 'Dancehall'],
  },
]
</script>

<template>
  <section id="events" class="events-section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Événements</span>
        <h2 class="section-title">Les Éditions du<br /><span class="text-orange">Petit Poto</span></h2>
        <p class="section-desc">Chaque édition est une expérience unique. Ne rate pas la prochaine.</p>
      </div>

      <div class="events-grid">
        <article
          v-for="event in events"
          :key="event.id"
          :class="['event-card', { upcoming: event.status === 'upcoming', past: event.status === 'past' }]"
        >
          <div class="card-img-wrap">
            <img :src="event.img" :alt="event.title" class="card-img" />
            <div class="card-img-overlay"></div>
            <div class="card-badges">
              <span v-if="event.status === 'upcoming'" class="badge badge-live">
                <span class="live-dot"></span> Bientôt
              </span>
              <span v-else class="badge badge-past">Passé</span>
              <span class="badge badge-edition">{{ event.edition }}</span>
            </div>
            <div v-if="event.status === 'upcoming'" class="tickets-left-bar">
              <div class="tlb-track">
                <div
                  class="tlb-fill"
                  :style="{ width: `${((event.totalTickets - event.ticketsLeft) / event.totalTickets) * 100}%` }"
                ></div>
              </div>
              <span class="tlb-text">{{ event.ticketsLeft }} places restantes</span>
            </div>
          </div>

          <div class="card-body">
            <div class="card-tags">
              <span v-for="tag in event.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <h3 class="card-title">{{ event.title }}</h3>

            <div class="card-meta">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ event.date }} · {{ event.time }}
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                {{ event.venue }}, {{ event.city }}
              </div>
            </div>

            <div class="card-artists">
              <span v-for="artist in event.artists" :key="artist" class="artist-chip">{{ artist }}</span>
            </div>

            <div class="card-footer">
              <span class="card-price">{{ event.price }}</span>
              <a
                v-if="event.status === 'upcoming'"
                href="#tickets"
                class="btn-primary card-btn"
              >
                Réserver
              </a>
              <a v-else href="#gallery" class="btn-secondary card-btn">
                Voir les photos
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.events-section {
  padding: 100px 0;
  background: var(--black);
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-desc {
  color: var(--white-dim);
  max-width: 460px;
  margin: 16px auto 0;
  font-size: 1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.event-card {
  background: var(--black-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}

.event-card:hover {
  border-color: var(--border-active);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
}

.event-card.upcoming {
  border-color: rgba(255, 122, 0, 0.2);
}

.card-img-wrap {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.event-card:hover .card-img {
  transform: scale(1.05);
}

.card-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(11,11,11,0.8) 0%, transparent 60%);
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: var(--radius-xl);
}

.badge-live {
  background: rgba(255, 122, 0, 0.15);
  border: 1px solid var(--orange);
  color: var(--orange);
}

.badge-past {
  background: rgba(245,245,245,0.08);
  border: 1px solid var(--border);
  color: var(--white-dim);
}

.badge-edition {
  background: rgba(123, 46, 255, 0.15);
  border: 1px solid var(--violet);
  color: var(--violet);
}

.live-dot {
  width: 6px;
  height: 6px;
  background: var(--orange);
  border-radius: 50%;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.tickets-left-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tlb-track {
  height: 3px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
  overflow: hidden;
}

.tlb-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--violet));
  border-radius: 2px;
  transition: width 1s ease;
}

.tlb-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--orange);
  letter-spacing: 0.04em;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-xl);
  background: var(--white-faint);
  color: var(--white-dim);
  letter-spacing: 0.04em;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.04em;
  color: var(--white);
  line-height: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--white-dim);
}

.meta-item svg { flex-shrink: 0; color: var(--orange); }

.card-artists {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.artist-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: var(--radius-xl);
  background: rgba(123, 46, 255, 0.1);
  border: 1px solid rgba(123, 46, 255, 0.25);
  color: #c49dff;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.card-price {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--orange);
}

.card-btn {
  font-size: 0.85rem;
  padding: 10px 20px;
}

@media (max-width: 768px) {
  .events-section { padding: 72px 0; }
  .events-grid { grid-template-columns: 1fr; }
  .section-header { margin-bottom: 40px; }
}
</style>
