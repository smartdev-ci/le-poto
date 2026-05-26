<script setup lang="ts">
import { ref } from 'vue'

const photos = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Édition 4 — La foule en feu',
    size: 'large',
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'DJ Myst en action',
    size: 'small',
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Ambiance VIP',
    size: 'small',
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Le public chante',
    size: 'wide',
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Édition 3 — Nuit inoubliable',
    size: 'small',
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg?auto=compress&cs=tinysrgb&w=600',
    caption: 'Lumières et fumée',
    size: 'small',
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'La scène principale',
    size: 'large',
  },
]

const lightboxPhoto = ref<typeof photos[0] | null>(null)

function openLightbox(photo: typeof photos[0]) {
  lightboxPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxPhoto.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <section id="gallery" class="gallery-section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Galerie</span>
        <h2 class="section-title">Le Paiya en<br /><span class="text-orange">Images</span></h2>
        <p class="section-desc">Tu étais là ? Reviens. Tu n'y étais pas ? Tu comprends maintenant.</p>
      </div>

      <div class="gallery-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          :class="['gallery-item', `size-${photo.size}`]"
          @click="openLightbox(photo)"
        >
          <img :src="photo.src" :alt="photo.caption" loading="lazy" />
          <div class="gallery-overlay">
            <div class="gallery-caption">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {{ photo.caption }}
            </div>
          </div>
        </div>
      </div>

      <div class="gallery-cta">
        <p class="gallery-fomo">+200 photos et vidéos sur nos réseaux</p>
        <div class="social-links">
          <a href="#" class="social-link instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram
          </a>
          <a href="#" class="social-link tiktok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.77a4.85 4.85 0 01-1-.08z"/></svg>
            TikTok
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <Teleport to="body">
    <div v-if="lightboxPhoto" class="lightbox" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <img :src="lightboxPhoto.src" :alt="lightboxPhoto.caption" class="lightbox-img" />
      <p class="lightbox-caption">{{ lightboxPhoto.caption }}</p>
    </div>
  </Teleport>
</template>

<style scoped>
.gallery-section {
  padding: 100px 0;
  background: var(--black-soft);
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-desc {
  color: var(--white-dim);
  max-width: 460px;
  margin: 16px auto 0;
  font-size: 1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 12px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--black-card);
}

.gallery-item.size-large {
  grid-column: span 2;
  grid-row: span 2;
}

.gallery-item.size-wide {
  grid-column: span 2;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.gallery-item:hover img {
  transform: scale(1.08);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(11,11,11,0.9) 0%, transparent 50%);
  opacity: 0;
  transition: opacity var(--transition);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--white);
}

.gallery-caption svg { color: var(--orange); }

.gallery-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 48px;
  flex-wrap: wrap;
}

.gallery-fomo {
  font-size: 0.9rem;
  color: var(--white-dim);
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-xl);
  font-size: 0.88rem;
  font-weight: 600;
  transition: var(--transition);
  border: 1.5px solid var(--border);
  color: var(--white-dim);
}

.social-link:hover {
  color: var(--white);
  border-color: var(--orange);
  background: var(--white-faint);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeInUp 0.2s ease;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: var(--white);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.lightbox-close:hover { background: rgba(255,255,255,0.2); }

.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-md);
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}

.lightbox-caption {
  margin-top: 16px;
  font-size: 0.9rem;
  color: var(--white-dim);
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 160px;
  }
  .gallery-item.size-large { grid-column: span 2; }
}

@media (max-width: 600px) {
  .gallery-section { padding: 72px 0; }
  .gallery-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 130px; }
  .gallery-item.size-large { grid-column: span 2; grid-row: span 1; }
  .gallery-item.size-wide { grid-column: span 2; }
  .gallery-cta { flex-direction: column; gap: 16px; }
}
</style>
