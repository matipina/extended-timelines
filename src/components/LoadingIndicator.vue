<template>
  <div class="loading-indicator" :class="variantClass">
    <span class="fetch-spinner"></span>
    <span class="fetch-text">{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  message: { type: String, required: true },
  variant: { type: String, default: '' } // e.g. 'fetch', 'initial', 'timeline'
});
const variantClass = computed(() => {
  if (!props.variant) return '';
  return `loading-${props.variant}`;
});
</script>

<style scoped>
.loading-indicator {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}
.loading-indicator {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  font-size: 1.3rem;
  color: #e0e0e0;
  letter-spacing: 0.5px;
  font-weight: 500;
  min-height: 220px;
}
.fetch-spinner {
  width: 38px;
  height: 38px;
  border: 3.5px solid #232323;
  border-top: 3.5px solid #7ecfff;
  border-radius: 50%;
  animation: spin 0.7s cubic-bezier(.6,.1,.4,.9) infinite;
  display: inline-block;
  box-shadow: 0 0 16px #7ecfff44;
  background: transparent;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.fetch-text {
  margin-top: 8px;
  color: #e0e0e0;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
