<template>
  <div class="timeline-nav-outer">
    <div class="timeline-nav-container" ref="scrollContainer">
      <button class="extend-button top" @click="$emit('extend', 'before')">+ Extend Past</button>
      <!-- Indicator for adding before: always above events -->
      <div v-if="isExtending && extendDirection === 'before'" class="insertion-indicator top-indicator">
        <span class="pulse-dot"></span>
      </div>
      <transition-group name="timeline-move" tag="div">
        <div
          v-for="(event, index) in events"
          :key="event.summary + event.date"
          class="timeline-item"
          :class="{ 'new-event': event.isNew }"
        >
          <div class="timeline-text">
            <div class="date">{{ event.date }}</div>
            <div class="title event-title">{{ event.summary }}</div>
          </div>
          <div class="timeline-point"></div>
        </div>
      </transition-group>
      <button
        v-if="events.length > 0"
        class="extend-button bottom align-right"
        @click="$emit('extend', 'after')"
      >+ Extend Future</button>
      <!-- Indicator for adding after: stays below events -->
      <div v-if="isExtending && extendDirection === 'after'" class="insertion-indicator bottom-indicator">
        <span class="pulse-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  events: Array,
  selectedIndex: Number,
  isExtending: Boolean,
  extendDirection: String,
});

const emit = defineEmits(["select", "extend"]);
const scrollContainer = ref(null);
const eventElements = ref([]);

// Auto-scroll to selected event
watch(
  () => props.selectedIndex,
  (newIndex) => {
    const element = eventElements.value[newIndex];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
);
</script>

<style scoped>
.timeline-nav-outer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 10;
  padding-top: 40px; /* Push events down to align with summary title */
}
.timeline-nav-container {
  flex: 1 1 auto;
  overflow-y: auto;
  position: relative;
  padding: 0 0 40px 0;
  box-sizing: border-box;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
}
.extend-button.top {
  position: static;
  margin-bottom: 32px; /* Add space below the button */
  margin-top: 0;
}
.timeline-nav-container::-webkit-scrollbar {
  display: none;
}

.timeline-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 60px;
  cursor: pointer;
  position: relative;
}

.timeline-text {
  text-align: right;
  margin-right: 20px;
  color: #777;
  transition: color 0.3s ease;
  word-break: break-word;
  white-space: normal;
  max-width: 80%;
}
.timeline-item:hover .timeline-text,
.timeline-item.selected .timeline-text {
  color: #e0e0e0;
}

.title {
  font-size: 1.2rem;
  font-weight: 400;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.date {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.timeline-point {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #555;
  background-color: #121212;
  flex-shrink: 0;
  transition: all 0.3s ease;
  z-index: 1;
  transform: translateX(50%);
}
.timeline-item.selected .timeline-point {
  background-color: #fff;
  border-color: #fff;
  transform: translateX(50%) scale(1.3);
}

.timeline-move-enter-active, .timeline-move-leave-active {
  transition: all 0.8s cubic-bezier(.23,1.02,.32,1);
}
.timeline-move-enter-from, .timeline-move-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
}

.extend-button {
  padding: 8px 16px;
  border: 1px solid #555;
  background-color: transparent;
  color: #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: fit-content;
  margin-right: 38px;
  margin-left: auto;
  display: block;
}
.extend-button.top {
  position: static;
  margin-bottom: 32px; /* Add space below the button */
  margin-top: 0;
}
.extend-button.bottom.align-right {
  align-self: flex-end;
  margin-right: 38px;
  margin-bottom: 0;
  margin-top: 0;
}

.new-event .timeline-text {
  color: #7ecfff;
}
.insertion-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}
.pulse-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7ecfff;
  box-shadow: 0 0 0 0 #7ecfff;
  animation: pulse 1.2s infinite cubic-bezier(0.66, 0, 0, 1);
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 #7ecfff99;
  }
  70% {
    box-shadow: 0 0 0 12px #7ecfff00;
  }
  100% {
    box-shadow: 0 0 0 0 #7ecfff00;
  }
}
.top-indicator {
  margin-bottom: 0;
}
.bottom-indicator {
  margin-top: 0;
}
.timeline-spinner-container {
  display: none;
}
.event-title {
  color: #fff;
  font-weight: 500;
}
</style>