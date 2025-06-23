<template>
  <div class="app-layout">
    <WelcomeOverlay v-if="showWelcome" @close="handleWelcomeClose" />
    <ArticleNav 
      :articles="articles" 
      :selected-index="selectedArticleIndex" 
      @select="handleArticleSelect" 
      @refresh="refreshArticles" 
      :isRefreshing="isLoading" 
    />
    <main class="content-area">
      <LoadingIndicator v-if="isLoading && isManualRefresh" message="Fetching new articles..." variant="fetch" />
      <LoadingIndicator v-else-if="isLoading && isInitialLoad" message="Loading articles..." variant="initial" />
      <LoadingIndicator v-else-if="isLoading && !isInitialLoad && !isManualRefresh" message="Generating timeline..." variant="timeline" />
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
import { useTimelineApp } from './composables/useTimelineApp.js';
import ArticleNav from "./components/ArticleNav.vue";
import TimelineNav from "./components/TimelineNav.vue";
import ContentDisplay from "./components/ContentDisplay.vue";
import WelcomeOverlay from "./components/WelcomeOverlay.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";

const {
  showWelcome,
  onboardingStep,
  articles,
  selectedArticleIndex,
  selectedEventIndex,
  timelineData,
  isLoading,
  isRemixing,
  extendDirection,
  isManualRefresh,
  isInitialLoad,
  handleWelcomeClose,
  handleArticleSelect,
  handleEventSelect,
  remixTimeline,
  handleExtend,
  refreshArticles
} = useTimelineApp();
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
</style>