<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const scanning = ref(false)
const error = ref('')
let animFrame: number
let jsQR: any = null

// Stats du jour
const scanCount = ref(0)
const validCount = ref(0)

async function startCamera() {
  error.value = ''
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      videoRef.value.play()
      scanning.value = true
      scanLoop()
    }
  } catch (e: any) {
    error.value = 'Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.'
  }
}

function stopCamera() {
  scanning.value = false
  if (stream.value) {
    stream.value.getTracks().forEach(t => t.stop())
    stream.value = null
  }
  if (animFrame) cancelAnimationFrame(animFrame)
}

async function scanLoop() {
  if (!scanning.value || !videoRef.value || !canvasRef.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    if (jsQR) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        stopCamera()
        await validateTicket(code.data)
        return
      }
    }
  }

  animFrame = requestAnimationFrame(scanLoop)
}

async function validateTicket(qrData: string) {
  try {
    let ticketRef = qrData
    try {
      const parsed = JSON.parse(qrData)
      ticketRef = parsed.ref || qrData
    } catch {}

    const { data: tickets } = await api.get(`/tickets?reference=eq.${ticketRef}`)
    scanCount.value++

    if (!tickets || tickets.length === 0) {
      router.push({ name: 'scan-result', query: { status: 'invalid', reason: 'Billet introuvable', ref: ticketRef } })
      return
    }

    const ticket = tickets[0]

    if (ticket.status === 'used') {
      router.push({ name: 'scan-result', query: { status: 'already_used', reason: 'Billet déjà utilisé', ref: ticketRef } })
      return
    }

    if (ticket.status === 'cancelled') {
      router.push({ name: 'scan-result', query: { status: 'invalid', reason: 'Billet annulé', ref: ticketRef } })
      return
    }

    // Mark as used
    await api.patch(`/tickets?id=eq.${ticket.id}`, { status: 'used' })
    validCount.value++

    router.push({
      name: 'scan-result',
      query: {
        status: 'valid',
        ref: ticketRef,
        ticketId: ticket.id
      }
    })
  } catch (e) {
    router.push({ name: 'scan-result', query: { status: 'error', reason: 'Erreur de validation', ref: qrData } })
  }
}

onMounted(async () => {
  // Lazy load jsQR
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js' as any)
    jsQR = mod.default || (window as any).jsQR
  } catch {}
  startCamera()
})

onUnmounted(() => stopCamera())
</script>

<template>
  <div class="scanner-page">
    <!-- Header -->
    <div class="scanner-header">
      <router-link to="/admin/dashboard" class="back-btn">← Dashboard</router-link>
      <div class="scanner-logo">
        <span>LE PETIT</span><span class="accent">POTO</span>
      </div>
      <div class="scanner-stats">
        <span class="stat">✅ {{ validCount }}</span>
        <span class="stat">📊 {{ scanCount }}</span>
      </div>
    </div>

    <!-- Camera view -->
    <div class="camera-wrap">
      <video ref="videoRef" class="camera-video" playsinline muted></video>
      <canvas ref="canvasRef" class="camera-canvas"></canvas>

      <!-- Scan overlay -->
      <div class="scan-overlay">
        <div class="scan-frame">
          <div class="corner tl"></div>
          <div class="corner tr"></div>
          <div class="corner bl"></div>
          <div class="corner br"></div>
          <div class="scan-line"></div>
        </div>
        <p class="scan-hint">Pointez la caméra sur le QR code du billet</p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="camera-error">
        <div class="error-icon">📷</div>
        <p>{{ error }}</p>
        <button @click="startCamera" class="retry-btn">Réessayer</button>
      </div>
    </div>

    <!-- Controls -->
    <div class="scanner-controls">
      <button class="control-btn" @click="scanning ? stopCamera() : startCamera()">
        {{ scanning ? '⏹ Arrêter' : '▶ Démarrer' }}
      </button>
      <div class="scan-status">
        <div :class="['status-dot', { active: scanning }]"></div>
        {{ scanning ? 'Scan actif' : 'Scan arrêté' }}
      </div>
    </div>

    <!-- Manual input -->
    <div class="manual-section">
      <p class="manual-label">Ou saisir la référence manuellement</p>
      <div class="manual-input-row">
        <input
          class="manual-input"
          type="text"
          placeholder="LPP-ABC12345-001"
          @keyup.enter="(e) => validateTicket((e.target as HTMLInputElement).value)"
        />
        <button class="manual-btn" @click="(e) => { const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement; validateTicket(input.value) }">
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scanner-page {
  min-height: 100vh;
  background: #0B0B0B;
  display: flex;
  flex-direction: column;
  font-family: 'Space Grotesk', sans-serif;
  color: #F5F5F5;
  max-width: 480px;
  margin: 0 auto;
}

.scanner-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #111111;
  border-bottom: 1px solid rgba(245,245,245,0.08);
}

.back-btn { font-size: 0.82rem; color: rgba(245,245,245,0.5); text-decoration: none; }
.scanner-logo { display: flex; gap: 4px; font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.1em; }
.accent { color: #FF7A00; }
.scanner-stats { display: flex; gap: 12px; }
.stat { font-size: 0.78rem; font-weight: 600; color: rgba(245,245,245,0.7); }

.camera-wrap {
  position: relative;
  flex: 1;
  min-height: 60vh;
  background: #000;
  overflow: hidden;
}

.camera-video, .camera-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.camera-canvas { opacity: 0; }

.scan-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.scan-frame {
  width: 260px;
  height: 260px;
  position: relative;
}

.corner {
  position: absolute;
  width: 32px;
  height: 32px;
  border-color: #FF7A00;
  border-style: solid;
}

.tl { top: 0; left: 0; border-width: 3px 0 0 3px; }
.tr { top: 0; right: 0; border-width: 3px 3px 0 0; }
.bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; }

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FF7A00, transparent);
  top: 50%;
  animation: scanAnim 2s ease-in-out infinite;
}

@keyframes scanAnim {
  0%, 100% { top: 10%; opacity: 0.5; }
  50% { top: 90%; opacity: 1; }
}

.scan-hint {
  font-size: 0.85rem;
  color: rgba(245,245,245,0.7);
  text-align: center;
  max-width: 240px;
  background: rgba(0,0,0,0.6);
  padding: 10px 16px;
  border-radius: 32px;
}

.camera-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(11,11,11,0.9);
  padding: 24px;
  text-align: center;
}

.error-icon { font-size: 3rem; }

.retry-btn {
  padding: 12px 24px;
  background: #FF7A00;
  color: #0B0B0B;
  border: none;
  border-radius: 32px;
  font-weight: 700;
  cursor: pointer;
}

.scanner-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #111111;
  border-top: 1px solid rgba(245,245,245,0.06);
}

.control-btn {
  padding: 10px 20px;
  background: rgba(255,122,0,0.1);
  border: 1.5px solid rgba(255,122,0,0.3);
  color: #FF7A00;
  border-radius: 32px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover { background: rgba(255,122,0,0.2); }

.scan-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: rgba(245,245,245,0.5);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(245,245,245,0.2);
  transition: background 0.2s;
}

.status-dot.active {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34,197,94,0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(34,197,94,0.5); }
  50% { box-shadow: 0 0 16px rgba(34,197,94,0.8); }
}

.manual-section {
  padding: 20px;
  border-top: 1px solid rgba(245,245,245,0.06);
}

.manual-label {
  font-size: 0.78rem;
  color: rgba(245,245,245,0.4);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.manual-input-row { display: flex; gap: 8px; }

.manual-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(245,245,245,0.06);
  border: 1.5px solid rgba(245,245,245,0.08);
  border-radius: 12px;
  color: #F5F5F5;
  font-family: 'Courier New', monospace;
  font-size: 0.88rem;
  outline: none;
  text-transform: uppercase;
}

.manual-input:focus { border-color: #FF7A00; }

.manual-btn {
  padding: 12px 20px;
  background: #FF7A00;
  color: #0B0B0B;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
}
</style>