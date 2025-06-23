<template>
  <nav class="article-nav">
    <div class="nav-pointer"></div>
    <div class="arrow left" @click="selectArticle('prev')">&#x2039;</div>
    <button class="refresh-icon" @click="$emit('refresh')" :aria-label="'Refresh articles'" :disabled="isRefreshing">
      <svg v-if="!isRefreshing" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.657 6.343A8 8 0 1 0 19 11" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 3v8h-8" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-else class="refresh-spinner"></span>
    </button>
    <div class="nav-scroll-window">
      <div
        class="nav-items-container"
        :style="{ transform: `translateX(${containerOffset}px)` }"
        ref="itemsContainer"
      >
        <div
          v-for="(article, index) in articles"
          :key="index"
          class="nav-item"
          :class="{ active: selectedIndex === index }"
          ref="navItems"
          @click="selectArticle(index)"
        >
          {{ article.title }}
        </div>
      </div>
    </div>
    <div class="arrow right" @click="selectArticle('next')">&#x203A;</div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps({
  articles: Array,
  selectedIndex: Number,
  isRefreshing: Boolean,
});
const emit = defineEmits(["select"]);
const itemsContainer = ref(null);
const navItems = ref([]);
const containerOffset = ref(0);

function calculateOffset() {
  if (!itemsContainer.value || navItems.value.length === 0) return;
  const windowCenter = itemsContainer.value.clientWidth / 2;
  const selectedItem = navItems.value[props.selectedIndex];
  if (!selectedItem) return;
  const itemCenter = selectedItem.offsetLeft + selectedItem.clientWidth / 2;
  containerOffset.value = windowCenter - itemCenter;
}

watch(() => props.selectedIndex, calculateOffset);

onMounted(() => {
  nextTick(calculateOffset);
  window.addEventListener("resize", calculateOffset);
});

function selectArticle(directionOrIndex) {
  emit("select", directionOrIndex);
}
</script>

<style scoped>
.article-nav {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  position: relative;
  height: 60px;
}
.nav-pointer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
  background-color: white;
}
.nav-scroll-window {
  flex-grow: 1;
  overflow: hidden;
}
.nav-items-container {
  display: flex;
  transition: transform 0.4s ease-out;
}
.nav-item {
  padding: 0 25px;
  line-height: 60px;
  color: #777;
  font-size: 1.1rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer; /* Make it clear nav items are clickable */
}
.nav-item.active {
  color: white;
  font-weight: 600;
  transform: scale(1.1);
}
.arrow {
  font-size: 2.5rem;
  color: #777;
  cursor: pointer;
  padding: 0 25px;
  user-select: none;
  z-index: 10;
}
.arrow:hover {
  color: white;
}
.refresh-icon {
  background: none;
  border: none;
  padding: 0 10px;
  margin: 0 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
  opacity: 0.7;
}
.refresh-icon[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.refresh-icon:hover {
  opacity: 1;
}
.refresh-icon svg {
  display: block;
}
.refresh-spinner {
  width: 22px;
  height: 22px;
  border: 2.5px solid #232323;
  border-top: 2.5px solid #7ecfff;
  border-radius: 50%;
  animation: spin 0.7s cubic-bezier(.6,.1,.4,.9) infinite;
  display: inline-block;
  box-shadow: 0 0 8px #7ecfff44;
  background: transparent;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>