<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.signIn(email.value, password.value)
    const redirect = route.query.redirect as string
    if (authStore.profile?.role === 'admin' || authStore.profile?.role === 'organizer') {
      router.push(redirect || '/admin/dashboard')
    } else {
      router.push(redirect || '/')
    }
  } catch (e: any) {
    error.value = e.message || 'Email ou mot de passe incorrect'
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
        <span>LE PETIT</span>
        <span class="accent">POTO</span>
      </router-link>

      <h1 class="auth-title">Connexion</h1>
      <p class="auth-sub">Accède à ton espace personnel</p>

      <div class="auth-form">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="ton@email.com" @keyup.enter="handleLogin" />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="handleLogin" />
        </div>

        <div v-if="error" class="error-box">{{ error }}</div>

        <button class="btn-primary auth-btn" :disabled="loading" @click="handleLogin">
          <span v-if="!loading">Se connecter →</span>
          <span v-else>Connexion...</span>
        </button>

        <p class="auth-switch">
          Pas encore de compte ?
          <router-link to="/register">S'inscrire</router-link>
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
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
}
.orb-1 { width: 400px; height: 400px; background: #FF7A00; top: -100px; right: -100px; }
.orb-2 { width: 300px; height: 300px; background: #7B2EFF; bottom: -80px; left: -80px; }

.auth-card {
  position: relative;
  z-index: 1;
  background: #161616;
  border: 1px solid rgba(245,245,245,0.08);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
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

.auth-sub {
  font-size: 0.9rem;
  color: rgba(245,245,245,0.5);
  margin-bottom: 32px;
}

.auth-form { display: flex; flex-direction: column; gap: 16px; }

.field { display: flex; flex-direction: column; gap: 8px; }

.field label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,245,245,0.5);
}

.field input {
  padding: 14px 16px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  border-radius: 12px;
  color: #F5F5F5;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
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
  justify-content: center;
  padding: 16px;
  font-size: 1rem;
  border-radius: 12px;
  margin-top: 4px;
  background: #FF7A00;
  color: #0B0B0B;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-btn:hover:not(:disabled) { background: #ff9933; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  font-size: 0.88rem;
  color: rgba(245,245,245,0.4);
}

.auth-switch a { color: #FF7A00; text-decoration: none; font-weight: 600; }

.back-link {
  text-align: center;
  font-size: 0.82rem;
  color: rgba(245,245,245,0.3);
  text-decoration: none;
  transition: color 0.2s;
  display: block;
}

.back-link:hover { color: rgba(245,245,245,0.6); }
</style>