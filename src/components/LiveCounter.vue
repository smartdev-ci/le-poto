<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const count = ref(Math.floor(Math.random() * 80) + 150)
const visible = ref(false)
let interval: ReturnType<typeof setInterval>
let showTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  showTimeout = setTimeout(() => { visible.value = true }, 3000)

  interval = setInterval(() => {
    const delta = Math.floor(Math.random() * 7) - 3
    count.value = Math.max(120, Math.min(300, count.value + delta))
  }, 4000)
})

onUnmounted(() => {
  clearInterval(interval)
  clearTimeout(showTimeout)
})
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" class="live-counter">
      <div class="counter-pulse"></div>
      <div class="counter-content">
        <span class="counter-num">{{ count }}</span>
        <span class="counter-text">personnes consultent en ce moment</span>
      </div>
      <button class="counter-dismiss" @click="visible = false" aria-label="Fermer">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.live-counter {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(22, 22, 22, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-active);
  border-radius: var(--radius-xl);
  padding: 12px 16px 12px 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,122,0,0.1);
  max-width: 280px;
}

.counter-pulse {
  width: 10px;
  height: 10px;
  background: var(--orange);
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse-glow 1.5s ease-in-out infinite;
  position: relative;
}

.counter-pulse::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: var(--orange);
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.counter-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.counter-num {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  color: var(--orange);
  line-height: 1;
}

.counter-text {
  font-size: 0.72rem;
  color: var(--white-dim);
  font-weight: 500;
  line-height: 1.3;
}

.counter-dismiss {
  background: none;
  border: none;
  color: rgba(245,245,245,0.3);
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 0 0 4px;
  cursor: pointer;
  transition: color var(--transition);
  margin-left: auto;
}

.counter-dismiss:hover { color: var(--white-dim); }

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 480px) {
  .live-counter {
    left: 16px;
    right: 16px;
    max-width: unset;
    bottom: 16px;
  }
}
</style>
