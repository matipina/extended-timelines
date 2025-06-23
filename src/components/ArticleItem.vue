<template>
  <div class="article-item" :class="{ selected: isSelected }" @click="selectArticle">
    {{ title }}
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  isSelected: Boolean,
});
const emit = defineEmits(["select"]);
function selectArticle() {
  emit("select");
}
</script>

<style scoped>
.article-item {
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;
  color: #555;
  text-align: center;
  transition: all 0.2s ease;
  border-radius: 8px;
}
.article-item:hover {
  color: #007aff;
  background-color: #f0f5ff;
}
.article-item.selected {
  color: #007aff;
  font-weight: 600;
}
</style>