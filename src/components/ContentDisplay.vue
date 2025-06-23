<template>
  <div class="content-container">
    <div class="summary-header">
      <button class="remix-button" @click="remix" :disabled="isRemixing">
        <span v-if="isRemixing" class="spinner"></span>
        <span v-else>
          <svg class="remix-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2v2.5M10 2a8 8 0 1 1-7.32 4.57" stroke="#7ecfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 2v4h4" stroke="#7ecfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Remix
        </span>
      </button>
      <div class="summary-title">
        <h1>{{ title }}</h1>
        <a v-if="wikiUrl" :href="wikiUrl" class="wiki-link" target="_blank" rel="noopener noreferrer">View on Wikipedia ↗</a>
      </div>
    </div>
    <div v-if="summary">
      <transition name="summary-fade" mode="out-in">
        <p :key="summaryKey">{{ summary }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  summary: String,
  title: String,
  wikiUrl: String,
  isRemixing: Boolean
});
const emit = defineEmits(["remix"]);
const summaryKey = ref(0);

watch(() => props.summary, () => {
  summaryKey.value++;
});

function remix() {
  emit("remix");
}
</script>

<style scoped>
.content-container {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 50%;
  min-width: 400px;
  max-width: 900px;
  padding-left: 40px;
  box-sizing: border-box;
  padding-top: 40px;
  overflow-y: auto;
  background: transparent;
  z-index: 2;
}
.summary-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.remix-button {
  margin-bottom: 2px;
  padding: 8px 18px;
  border: 1px solid #555;
  background-color: transparent;
  color: #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 7px;
}
.remix-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.remix-button:hover {
  background-color: #232323;
  color: #7ecfff;
}
.remix-icon {
  display: inline-block;
  vertical-align: middle;
}
.summary-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
}
p {
  font-size: 1.18rem;
  line-height: 1.7;
  color: #aaa;
  max-width: 700px;
  margin-right: 40px;
}
.wiki-link {
  color: #7ecfff;
  font-size: 1rem;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}
.wiki-link:hover {
  color: #fff;
  text-decoration: underline;
}
.summary-fade-enter-active, .summary-fade-leave-active {
  transition: opacity 0.5s, filter 0.5s;
}
.summary-fade-enter-from, .summary-fade-leave-to {
  opacity: 0;
  filter: blur(8px);
}
</style>