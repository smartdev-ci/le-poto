<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  if (!fullName.value || !email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  loading.value = true
  try {
    await authStore.signUp(email.value, password.value, fullName.value, phone.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="auth-card">
      <router-link to="/" class="auth-logo">
        <span>LE PETIT</span><span class="accent">POTO</span>
      </router-link>

      <h1 class="auth-title">Inscription</h1>
      <p class="auth-sub">Rejoins la communauté Le Petit Poto</p>

      <div class="auth-form">
        <div class="field">
          <label>Nom complet *</label>
          <input v-model="fullName" type="text" placeholder="Kouamé Adjoua" />
        </div>
        <div class="field">
          <label>Email *</label>
          <input v-model="email" type="email" placeholder="ton@email.com" />
        </div>
        <div class="field">
          <label>Téléphone</label>
          <input v-model="phone" type="tel" placeholder="+225 07 XX XX XX XX" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Mot de passe *</label>
            <input v-model="password" type="password" placeholder="••••••••" />
          </div>
          <div class="field">
            <label>Confirmer *</label>
            <input v-model="confirmPassword" type="password" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="error-box">{{ error }}</div>

        <button class="auth-btn" :disabled="loading" @click="handleRegister">
          <span v-if="!loading">Créer mon compte →</span>
          <span v-else>Inscription...</span>
        </button>

        <p class="auth-switch">
          Déjà un compte ?
          <router-link to="/login">Se connecter</router-link>
        </p>

        <router-link to="/" class="back-link">← Retour au site</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0B0B;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Space Grotesk', sans-serif;
}

.auth-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.2; }
.orb-1 { width: 400px; height: 400px; background: #7B2EFF; top: -100px; left: -100px; }
.orb-2 { width: 300px; height: 300px; background: #FF7A00; bottom: -80px; right: -80px; }

.auth-card {
  position: relative;
  z-index: 1;
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-logo {
  display: flex;
  gap: 6px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.1em;
  color: #F5F5F5;
  text-decoration: none;
  margin-bottom: 32px;
}
.accent { color: #FF7A00; }

.auth-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 0.04em;
  color: #F5F5F5;
  line-height: 1;
  margin-bottom: 8px;
}

.auth-sub { font-size: 0.9rem; color: rgba(245,245,245,0.5); margin-bottom: 32px; }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 8px; }

.field label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,245,245,0.5);
}

.field input {
  padding: 13px 16px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  border-radius: 12px;
  color: #F5F5F5;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus { border-color: #FF7A00; }
.field input::placeholder { color: rgba(245,245,245,0.25); }

.error-box {
  padding: 12px 16px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.85rem;
}

.auth-btn {
  width: 100%;
  padding: 15px;
  background: #FF7A00;
  color: #0B0B0B;
  border: none;
  border-radius: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.auth-btn:hover:not(:disabled) { background: #ff9933; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  font-size: 0.88rem;
  color: rgba(245,245,245,0.4);
}

.auth-switch a { color: #FF7A00; text-decoration: none; font-weight: 600; }
.back-link { text-align: center; font-size: 0.82rem; color: rgba(245,245,245,0.3); text-decoration: none; transition: color 0.2s; display: block; }
.back-link:hover { color: rgba(245,245,245,0.6); }
</style>