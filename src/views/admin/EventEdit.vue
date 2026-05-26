<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')

const form = ref({
  id: '',
  name: 'Le Petit Poto - Édition 5',
  date: '28 Juin 2026',
  venue: 'Palais de la Culture, Abidjan',
  description: 'Le Grand Retour - L\'événement culturel incontournable de l\'année',
  price: 5000,
  tickets_total: 500,
  is_active: true,
})

onMounted(async () => {
  try {
    const { data } = await api.get('/event_config?limit=1')
    if (data[0]) Object.assign(form.value, data[0])
  } catch {}
  loading.value = false
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (form.value.id) {
      await api.patch(`/event_config?id=eq.${form.value.id}`, {
        name: form.value.name,
        date: form.value.date,
        venue: form.value.venue,
        description: form.value.description,
        price: form.value.price,
        tickets_total: form.value.tickets_total,
        is_active: form.value.is_active,
      })
    }
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    error.value = 'Erreur lors de la sauvegarde'
  }
  saving.value = false
}
</script>

<template>
  <div class="event-edit-page">
    <div class="page-header">
      <div>
        <h1>Événement</h1>
        <p>Modifier les informations de l'édition 5</p>
      </div>
      <div class="save-area">
        <div v-if="saved" class="saved-toast">✅ Sauvegardé !</div>
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div> Chargement...
    </div>

    <template v-else>
      <div class="form-grid">
        <div class="form-card">
          <h3>Informations générales</h3>

          <div class="field">
            <label>Nom de l'événement</label>
            <input v-model="form.name" type="text" />
          </div>

          <div class="field-row">
            <div class="field">
              <label>Date</label>
              <input v-model="form.date" type="text" placeholder="28 Juin 2026" />
            </div>
            <div class="field">
              <label>Statut</label>
              <div class="toggle-wrap">
                <button
                  :class="['toggle', { active: form.is_active }]"
                  @click="form.is_active = !form.is_active"
                >
                  {{ form.is_active ? '🟢 Actif' : '🔴 Inactif' }}
                </button>
              </div>
            </div>
          </div>

          <div class="field">
            <label>Lieu</label>
            <input v-model="form.venue" type="text" />
          </div>

          <div class="field">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>
        </div>

        <div class="form-card">
          <h3>Billetterie</h3>

          <div class="field">
            <label>Prix par billet (FCFA)</label>
            <input v-model="form.price" type="number" min="0" step="500" />
            <span class="field-hint">Prix fixe pour tous les billets</span>
          </div>

          <div class="field">
            <label>Nombre total de places</label>
            <input v-model="form.tickets_total" type="number" min="1" />
          </div>

          <div class="preview-card">
            <div class="preview-label">Aperçu du billet</div>
            <div class="preview-price">
              <span class="preview-num">{{ form.price.toLocaleString('fr-FR') }}</span>
              <span class="preview-currency">FCFA</span>
            </div>
            <div class="preview-name">{{ form.name }}</div>
            <div class="preview-details">{{ form.date }} · {{ form.venue }}</div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-box">{{ error }}</div>
    </template>
  </div>
</template>

<style scoped>
.event-edit-page { padding: 32px; font-family: 'Space Grotesk', sans-serif; color: #F5F5F5; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; flex-wrap: wrap; }

.page-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.04em; line-height: 1; margin-bottom: 4px; }
.page-header p { font-size: 0.85rem; color: rgba(245,245,245,0.45); }

.save-area { display: flex; align-items: center; gap: 12px; }

.saved-toast {
  padding: 8px 16px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 32px;
  color: #22c55e;
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.save-btn {
  padding: 12px 24px;
  background: #FF7A00;
  color: #0B0B0B;
  border: none;
  border-radius: 32px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) { background: #ff9933; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.loading { display: flex; align-items: center; gap: 10px; color: rgba(245,245,245,0.4); }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,122,0,0.2); border-top-color: #FF7A00; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.form-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }

.form-card {
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-card h3 { font-size: 1rem; font-weight: 700; color: rgba(245,245,245,0.7); padding-bottom: 12px; border-bottom: 1px solid rgba(245,245,245,0.06); }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 8px; }

.field label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,245,245,0.4);
}

.field input, .field textarea {
  padding: 12px 14px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  border-radius: 10px;
  color: #F5F5F5;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

.field input:focus, .field textarea:focus { border-color: #FF7A00; }

.field-hint { font-size: 0.75rem; color: rgba(245,245,245,0.3); }

.toggle {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid rgba(245,245,245,0.1);
  background: rgba(245,245,245,0.04);
  color: rgba(245,245,245,0.5);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.toggle.active { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.3); color: #22c55e; }

.preview-card {
  background: linear-gradient(135deg, #FF7A00 0%, #ff9933 100%);
  border-radius: 12px;
  padding: 20px;
  margin-top: 8px;
}

.preview-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(0,0,0,0.5); margin-bottom: 8px; }
.preview-price { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; }
.preview-num { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.04em; color: #0B0B0B; line-height: 1; }
.preview-currency { font-size: 0.9rem; font-weight: 700; color: rgba(0,0,0,0.6); }
.preview-name { font-size: 0.88rem; font-weight: 700; color: #0B0B0B; margin-bottom: 4px; }
.preview-details { font-size: 0.78rem; color: rgba(0,0,0,0.5); }

.error-box {
  margin-top: 16px;
  padding: 14px 18px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.85rem;
}

@media (max-width: 900px) { .form-grid { grid-template-columns: 1fr; } }
</style>