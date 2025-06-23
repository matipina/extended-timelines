<template>
  <div class="app-layout">
    <ArticleNav 
      :articles="articles" 
      :selected-index="selectedArticleIndex" 
      @select="handleArticleSelect" 
      @refresh="refreshArticles" 
      :isRefreshing="isLoading" 
    />
    <main class="content-area">
      <div v-if="isLoading && isManualRefresh" class="loading-indicator loading-fetch">
        <span class="fetch-spinner"></span>
        <span class="fetch-text">Fetching new articles...</span>
      </div>
      <div v-else-if="isLoading && isInitialLoad" class="loading-indicator loading-initial">
        <span class="fetch-spinner"></span>
        <span class="fetch-text">Loading articles...</span>
      </div>
      <div v-else-if="isLoading && !isInitialLoad && !isManualRefresh" class="loading-indicator loading-timeline">
        <span class="fetch-spinner"></span>
        <span class="fetch-text">Generating timeline...</span>
      </div>
      <div v-else-if="!isLoading && !isInitialLoad && articles.length === 0" class="fallback-message">
        Could not find any articles with timeline events. Please try refreshing again.
      </div>
      <template v-else-if="timelineData">
        <div class="center-timeline-line"></div>
        <TimelineNav 
          :events="timelineData.events.filter(e => e && e.summary && e.date)" 
          :selected-index="selectedEventIndex" 
          @select="handleEventSelect" 
          @extend="handleExtend" 
          :isExtending="timelineData.isExtending" 
          :extendDirection="extendDirection"
        />
        <ContentDisplay 
          :summary="timelineData.overall_summary" 
          :title="articles[selectedArticleIndex]?.title || ''"
          :wikiUrl="articles[selectedArticleIndex] ? `https://en.wikipedia.org/wiki/${encodeURIComponent(articles[selectedArticleIndex].title.replace(/ /g, '_'))}` : ''"
          :isRemixing="isRemixing"
          @remix="remixTimeline"
        />
      </template>
      <div v-else class="placeholder">Select an article to begin.</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ArticleNav from "./components/ArticleNav.vue";
import TimelineNav from "./components/TimelineNav.vue";
import ContentDisplay from "./components/ContentDisplay.vue";

// --- STATE MANAGEMENT ---
const articles = ref([]);
const selectedArticleIndex = ref(-1);
const selectedEventIndex = ref(0);
const timelineData = ref(null);
const isLoading = ref(false);
const isRemixing = ref(false);
const extendDirection = ref(null);
const timelines = ref({}); // Cache timelines by article title
const isManualRefresh = ref(false);
const isInitialLoad = ref(true);

// --- COMPUTED PROPERTIES ---
const selectedEvent = computed(() => {
  if (timelineData.value && timelineData.value.events) {
    return timelineData.value.events[selectedEventIndex.value];
  }
  return null;
});

// --- METHODS ---
const handleArticleSelect = async (directionOrIndex) => {
  let newIndex;

  if (typeof directionOrIndex === 'string') {
    // Handling 'prev' and 'next' from the arrows
    const currentIndex = selectedArticleIndex.value;
    if (directionOrIndex === 'next') {
      newIndex = (currentIndex + 1) % articles.value.length;
    } else { // 'prev'
      newIndex = (currentIndex - 1 + articles.value.length) % articles.value.length;
    }
  } else {
    // Handling direct click (if you add that functionality back)
    newIndex = directionOrIndex;
  }

  // Prevent re-fetching if the index hasn't changed
  if (selectedArticleIndex.value === newIndex) return;

  selectedArticleIndex.value = newIndex;
  selectedEventIndex.value = 0; // Always reset to the first event
  isLoading.value = true;
  timelineData.value = null;

  const article = articles.value[newIndex];
  const cacheKey = article.title;
  if (timelines.value[cacheKey]) {
    timelineData.value = JSON.parse(JSON.stringify(timelines.value[cacheKey]));
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch("/api/generateTimeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleText: article.content }),
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    if (data.events && data.events.length > 0) {
      timelineData.value = data;
      timelines.value[cacheKey] = JSON.parse(JSON.stringify(data));
    } else {
      timelineData.value = null;
      // No alert, just clear timeline
    }
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    // Optionally set an error state to show in the UI
  } finally {
    isLoading.value = false;
  }
};

const handleEventSelect = (index) => {
  selectedEventIndex.value = index;
};

const remixTimeline = async () => {
  if (!timelineData.value) return;
  const events = timelineData.value.events;
  for (let i = events.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [events[i], events[j]] = [events[j], events[i]];
  }
  selectedEventIndex.value = 0;
  isRemixing.value = true;
  try {
    const subject = articles.value[selectedArticleIndex.value]?.title || "";
    const shuffledSummaries = events.map(e => e.summary).join(", ");
    const response = await fetch("/api/remixTimeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shuffledSummaries, subject }),
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    timelineData.value.overall_summary = data.summary;
    // Update cache with the remixed timeline
    const cacheKey = articles.value[selectedArticleIndex.value]?.title;
    if (cacheKey) {
      timelines.value[cacheKey] = JSON.parse(JSON.stringify(timelineData.value));
    }
  } catch (error) {
    console.error("Failed to remix summary:", error);
  } finally {
    isRemixing.value = false;
  }
};

const handleExtend = async (direction) => {
  extendDirection.value = direction;
  if (!timelineData.value) return;
  const events = timelineData.value.events;
  const summary = timelineData.value.overall_summary;
  const subject = articles.value[selectedArticleIndex.value]?.title || "";
  try {
    timelineData.value.isExtending = true;
    const response = await fetch("/api/extendTimeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events,
        direction,
        summary,
        subject
      })
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    // Mark new events with a flag for special styling
    const newEvents = (data.new_events || []).map(e => ({ ...e, isNew: true }));
    if (direction === 'before') {
      timelineData.value.events = [...newEvents, ...timelineData.value.events];
    } else {
      timelineData.value.events = [...timelineData.value.events, ...newEvents];
    }
    timelineData.value.overall_summary = data.new_summary || summary;
  } catch (error) {
    console.error("Failed to extend timeline:", error);
  } finally {
    timelineData.value.isExtending = false;
    // extendDirection.value = null; // Removed so indicator works
  }
};

// Fetch random Wikipedia articles (no timeline filtering for speed)
async function fetchArticlesWithEvents(minCount = 7, maxAttempts = 40) {
  const filtered = [];
  let attempts = 0;
  while (filtered.length < minCount && attempts < maxAttempts) {
    attempts++;
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    if (!response.ok) continue;
    const a = await response.json();
    const timelineRes = await fetch('/api/generateTimeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText: a.extract })
    });
    if (!timelineRes.ok) continue;
    const timelineData = await timelineRes.json();
    if (timelineData.events && timelineData.events.length > 0) {
      filtered.push({ title: a.title, content: a.extract });
      timelines.value[a.title] = timelineData;
    }
  }
  return filtered;
}

onMounted(async () => {
  isInitialLoad.value = true;
  isLoading.value = true;
  articles.value = [];
  try {
    articles.value = await fetchArticlesWithEvents(7, 40);
  } catch (e) {
    console.error(e);
    articles.value = [];
  } finally {
    isLoading.value = false;
    isInitialLoad.value = false;
  }
});

const refreshArticles = async () => {
  isLoading.value = true;
  isManualRefresh.value = true;
  try {
    articles.value = await fetchArticlesWithEvents(7, 40);
    selectedArticleIndex.value = -1;
    timelineData.value = null;
  } catch (e) {
    console.error(e);
    articles.value = [];
  } finally {
    isLoading.value = false;
    isManualRefresh.value = false;
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
}

.main-navbar {
  width: 100%;
  height: 54px;
  background: #191c1f;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 32px;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  z-index: 100;
  position: relative;
}

.navbar-title {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.content-area {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0;
  overflow: hidden;
}

.center-timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background-color: #333;
  z-index: 0;
}

.loading-indicator,
.placeholder {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
}

.loading-indicator.loading-fetch,
.loading-indicator.loading-initial,
.loading-indicator.loading-timeline {
  display: flex;
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

.fetch-text {
  margin-top: 8px;
  color: #e0e0e0;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.refresh-container {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 30;
  pointer-events: auto;
}

.refresh-button {
  margin: 0;
  padding: 10px 22px;
  border: 1px solid #555;
  background-color: #232323;
  color: #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 20;
}

.refresh-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #555;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.fallback-message {
  color: #e0e0e0;
  font-size: 1.1rem;
  margin-top: 24px;
  text-align: center;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>