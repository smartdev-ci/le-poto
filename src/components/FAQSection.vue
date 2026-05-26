<script setup lang="ts">
import { ref } from 'vue'

const faqs = [
  {
    id: 1,
    q: 'Comment acheter mon billet ?',
    a: 'Sur ce site, clique sur "Réserver maintenant", choisis ton type de billet (Early Bird, Standard ou VIP), sélectionne la quantité et paye via Orange Money, MTN Money, Wave ou carte bancaire. Ton ticket QR t\'est envoyé par email et WhatsApp en moins de 2 minutes.',
  },
  {
    id: 2,
    q: 'Comment vais-je recevoir mon billet ?',
    a: 'Dès confirmation du paiement, tu reçois un ticket PDF avec QR code unique par email et par WhatsApp. Conserve-le sur ton téléphone ou imprime-le. Le QR code sera scanné à l\'entrée.',
  },
  {
    id: 3,
    q: 'Quels modes de paiement sont acceptés ?',
    a: 'Nous acceptons Orange Money, MTN Money, Wave et carte bancaire. Tous les paiements sont 100% sécurisés. Aucun frais supplémentaire n\'est ajouté au prix affiché.',
  },
  {
    id: 4,
    q: 'Puis-je me faire rembourser ?',
    a: 'En cas d\'annulation de l\'événement, tu es remboursé intégralement dans les 72h. En revanche, si tu ne peux pas venir, le billet n\'est pas remboursable mais il est cessible : tu peux l\'offrir à quelqu\'un d\'autre.',
  },
  {
    id: 5,
    q: 'Qu\'est-ce que le ticket VIP inclut exactement ?',
    a: 'Le ticket VIP donne accès à : zone VIP exclusive (espace privé proche de la scène), 3 consommations offertes, accès backstage, session photo avec les artistes, et un goodies bag premium. Il est fortement recommandé de réserver tôt car les places sont très limitées (50 max).',
  },
  {
    id: 6,
    q: 'Mon billet QR est-il sécurisé contre la fraude ?',
    a: 'Oui. Chaque QR code est unique, signé numériquement et ne peut être utilisé qu\'une seule fois. Notre système de scan détecte immédiatement les duplications et les faux tickets. En cas de doute, l\'équipe de sécurité peut vérifier l\'authenticité.',
  },
  {
    id: 7,
    q: 'Y a-t-il un âge minimum pour accéder à l\'événement ?',
    a: 'Oui, l\'événement est réservé aux personnes de 18 ans et plus. Une pièce d\'identité valide sera demandée à l\'entrée.',
  },
  {
    id: 8,
    q: 'Où se déroule l\'événement et comment y accéder ?',
    a: 'L\'Édition 5 se tient au Palais de la Culture, Abidjan. Le parking est gratuit et sécurisé. Des navettes depuis les principaux quartiers seront organisées (détails à venir sur nos réseaux sociaux).',
  },
]

const openId = ref<number | null>(null)

function toggle(id: number) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="faq-inner">
        <div class="faq-header">
          <span class="section-label">FAQ</span>
          <h2 class="section-title">Tu as des<br /><span class="text-orange">questions ?</span></h2>
          <p class="faq-desc">
            On a les réponses. Si tu ne trouves pas ce que tu cherches,
            contacte-nous sur WhatsApp.
          </p>
          <a href="https://wa.me/2250700000000" class="whatsapp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Nous contacter
          </a>
        </div>

        <div class="faq-list">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            :class="['faq-item', { open: openId === faq.id }]"
          >
            <button class="faq-question" @click="toggle(faq.id)">
              <span>{{ faq.q }}</span>
              <svg
                class="faq-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="faq-answer">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  padding: 100px 0;
  background: var(--black-soft);
}

.faq-inner {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 80px;
  align-items: start;
}

.faq-header {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-desc {
  font-size: 0.95rem;
  color: var(--white-dim);
  line-height: 1.6;
  margin-top: 4px;
}

.whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(37, 211, 102, 0.1);
  border: 1.5px solid rgba(37, 211, 102, 0.3);
  color: #25d366;
  font-weight: 600;
  font-size: 0.88rem;
  padding: 12px 20px;
  border-radius: var(--radius-xl);
  transition: var(--transition);
  margin-top: 8px;
  width: fit-content;
}

.whatsapp-btn:hover {
  background: rgba(37, 211, 102, 0.18);
  border-color: #25d366;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.faq-item:first-child {
  border-top: 1px solid var(--border);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  background: none;
  border: none;
  color: var(--white);
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition);
}

.faq-question:hover { color: var(--orange); }
.faq-item.open .faq-question { color: var(--orange); }

.faq-icon {
  flex-shrink: 0;
  color: var(--orange);
  transition: transform var(--transition);
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-answer {
  max-height: 300px;
}

.faq-answer p {
  padding-bottom: 20px;
  font-size: 0.9rem;
  color: var(--white-dim);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .faq-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .faq-header { position: static; }
}

@media (max-width: 768px) {
  .faq-section { padding: 72px 0; }
}
</style>
