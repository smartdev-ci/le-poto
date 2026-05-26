<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{ targetDate: Date }>()

const now = ref(Date.now())
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(interval))

const diff = computed(() => {
  const ms = props.targetDate.getTime() - now.value
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  }
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="countdown">
    <div class="countdown-unit">
      <span class="countdown-num">{{ pad(diff.days) }}</span>
      <span class="countdown-name">Jours</span>
    </div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit">
      <span class="countdown-num">{{ pad(diff.hours) }}</span>
      <span class="countdown-name">Heures</span>
    </div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit">
      <span class="countdown-num">{{ pad(diff.minutes) }}</span>
      <span class="countdown-name">Min</span>
    </div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit">
      <span class="countdown-num">{{ pad(diff.seconds) }}</span>
      <span class="countdown-name">Sec</span>
    </div>
  </div>
</template>

<style scoped>
.countdown {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 64px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 8px;
}

.countdown-num {
  font-family: var(--font-display);
  font-size: 2.4rem;
  letter-spacing: 0.04em;
  line-height: 1;
  color: var(--orange);
}

.countdown-name {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white-dim);
}

.countdown-sep {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--orange);
  padding-top: 8px;
  line-height: 1;
  opacity: 0.5;
}

@media (max-width: 480px) {
  .countdown-unit { min-width: 52px; padding: 10px 6px; }
  .countdown-num { font-size: 1.8rem; }
}
</style>
