<script setup lang="ts">
const currentYear = new Date().getFullYear()

const navColumns = [
  {
    title: 'Navigation',
    links: [
      { label: 'Accueil', href: '#hero' },
      { label: 'Événements', href: '#events' },
      { label: 'Billetterie', href: '#tickets' },
      { label: 'Galerie', href: '#gallery' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Tickets',
    links: [
      { label: 'Early Bird', href: '#tickets' },
      { label: 'Standard', href: '#tickets' },
      { label: 'VIP', href: '#tickets' },
      { label: 'Éditions passées', href: '#events' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Conditions générales', href: '#' },
      { label: 'Politique de remboursement', href: '#' },
      { label: 'Confidentialité', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
]

const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  },
  {
    name: 'TikTok',
    href: '#',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.77a4.85 4.85 0 01-1-.08z"/></svg>`,
  },
  {
    name: 'Snapchat',
    href: '#',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.166.006C9.847.006 5.55 1.01 5.438 6.325c0 .394-.006.801-.013 1.215-.032 1.927-.065 3.953.4 5.19-.235.343-.754.612-1.466.612-.264 0-.544-.04-.832-.12-.052-.013-.102-.019-.152-.019-.46 0-.849.343-.923.8-.074.455.21.89.673 1.012 1.688.456 2.197 1.267 2.272 1.375.636 1.062.58 2.24.483 2.788-.013.073-.026.14-.026.21 0 .63.502 1.101 1.204 1.101.2 0 .414-.044.638-.131.6-.233 1.312-.37 2.006-.37.633 0 1.166.1 1.59.295C12.18 20.6 13.042 21 14.3 21c2.058 0 2.966-1.34 3.146-2.1.28-.115.558-.172.826-.172.664 0 1.367.222 2.006.622.266.166.544.258.803.258.633 0 1.094-.46 1.094-1.074 0-.08-.013-.158-.033-.237-.148-.84.136-2.03.761-2.989.157-.24.782-.876 2.283-1.26.466-.122.753-.56.68-1.015-.073-.454-.458-.8-.922-.8-.048 0-.1.006-.15.018-.288.08-.571.12-.84.12-.722 0-1.239-.27-1.47-.612.47-1.237.435-3.262.402-5.19-.007-.413-.013-.82-.013-1.215C22.449 1.01 18.152.006 12.166.006z"/></svg>`,
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-top-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-text">LE PETIT</span>
            <span class="logo-accent">POTO</span>
          </div>
          <p class="footer-tagline">
            La soirée la plus électrique d'Abidjan.<br />
            Rejoins le mouvement.
          </p>
          <div class="footer-socials">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              :aria-label="social.name"
              class="social-icon"
              v-html="social.icon"
            ></a>
          </div>
        </div>

        <div class="footer-nav">
          <div v-for="col in navColumns" :key="col.title" class="footer-col">
            <h4 class="footer-col-title">{{ col.title }}</h4>
            <ul>
              <li v-for="link in col.links" :key="link.label">
                <a :href="link.href">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-newsletter">
      <div class="container newsletter-inner">
        <div class="newsletter-text">
          <h4>Sois le premier à savoir</h4>
          <p>Reçois les annonces des prochaines éditions avant tout le monde.</p>
        </div>
        <form class="newsletter-form" @submit.prevent>
          <input type="email" placeholder="ton.email@exemple.com" class="newsletter-input" />
          <button type="submit" class="btn-primary newsletter-btn">S'inscrire</button>
        </form>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p class="footer-copy">© {{ currentYear }} Le Petit Poto. Tous droits réservés.</p>
        <p class="footer-made">Fait avec passion à Abidjan, Côte d'Ivoire</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--black-soft);
  border-top: 1px solid var(--border);
}

.footer-top { padding: 72px 0 48px; }

.footer-top-inner {
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 80px;
}

.footer-logo {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.1em;
  color: var(--white);
}

.logo-accent {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.1em;
  color: var(--orange);
}

.footer-tagline {
  font-size: 0.9rem;
  color: var(--white-dim);
  line-height: 1.6;
  margin-bottom: 24px;
}

.footer-socials {
  display: flex;
  gap: 8px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white-faint);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-dim);
  transition: var(--transition);
}

.social-icon:hover {
  background: var(--orange-glow);
  border-color: var(--orange);
  color: var(--orange);
  transform: translateY(-2px);
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-col h4 {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  margin-bottom: 20px;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col a {
  font-size: 0.88rem;
  color: var(--white-dim);
  transition: color var(--transition);
}

.footer-col a:hover { color: var(--orange); }

.footer-newsletter {
  border-top: 1px solid var(--border);
  padding: 32px 0;
  background: rgba(255, 122, 0, 0.03);
}

.newsletter-inner {
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.newsletter-text h4 {
  font-weight: 700;
  font-size: 1rem;
  color: var(--white);
  margin-bottom: 4px;
}

.newsletter-text p {
  font-size: 0.85rem;
  color: var(--white-dim);
}

.newsletter-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.newsletter-input {
  padding: 12px 16px;
  background: var(--white-faint);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-xl);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  min-width: 240px;
  transition: border-color var(--transition);
}

.newsletter-input:focus { border-color: var(--orange); }
.newsletter-input::placeholder { color: rgba(245,245,245,0.3); }

.newsletter-btn { font-size: 0.9rem; padding: 12px 24px; }

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 20px 0;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-copy, .footer-made {
  font-size: 0.8rem;
  color: rgba(245,245,245,0.35);
}

@media (max-width: 900px) {
  .footer-top-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-nav { grid-template-columns: repeat(3, 1fr); gap: 24px; }
}

@media (max-width: 600px) {
  .footer-top { padding: 48px 0 32px; }
  .footer-nav { grid-template-columns: 1fr 1fr; }
  .newsletter-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
  .newsletter-form { width: 100%; }
  .newsletter-input { min-width: unset; flex: 1; }
  .footer-bottom-inner { flex-direction: column; align-items: center; text-align: center; }
}
</style>
