import { ref, computed, onMounted, watch } from 'vue';

export function useTimelineApp() {
  // --- STATE ---
  const showWelcome = ref(true);
  const onboardingStep = ref(0); // 0: none, 1: select, 2: extend past, 3: extend future, 4: remix
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

  // --- COMPUTED ---
  const selectedEvent = computed(() => {
    if (timelineData.value && timelineData.value.events) {
      return timelineData.value.events[selectedEventIndex.value];
    }
    return null;
  });

  // --- METHODS ---
  const handleWelcomeClose = () => {
    showWelcome.value = false;
    onboardingStep.value = 1;
  };

  const handleArticleSelect = async (directionOrIndex) => {
    let newIndex;
    if (typeof directionOrIndex === 'string') {
      const currentIndex = selectedArticleIndex.value;
      if (directionOrIndex === 'next') {
        newIndex = (currentIndex + 1) % articles.value.length;
      } else {
        newIndex = (currentIndex - 1 + articles.value.length) % articles.value.length;
      }
    } else {
      newIndex = directionOrIndex;
    }
    if (selectedArticleIndex.value === newIndex) return;
    selectedArticleIndex.value = newIndex;
    selectedEventIndex.value = 0;
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
      const response = await fetch('/api/generateTimeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleText: article.content }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        timelineData.value = data;
        timelines.value[cacheKey] = JSON.parse(JSON.stringify(data));
      } else {
        timelineData.value = null;
      }
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
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
      const subject = articles.value[selectedArticleIndex.value]?.title || '';
      const shuffledSummaries = events.map(e => e.summary).join(', ');
      const response = await fetch('/api/remixTimeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shuffledSummaries, subject }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      timelineData.value.overall_summary = data.summary;
      const cacheKey = articles.value[selectedArticleIndex.value]?.title;
      if (cacheKey) {
        timelines.value[cacheKey] = JSON.parse(JSON.stringify(timelineData.value));
      }
    } catch (error) {
      console.error('Failed to remix summary:', error);
    } finally {
      isRemixing.value = false;
    }
  };

  const handleExtend = async (direction) => {
    extendDirection.value = direction;
    if (!timelineData.value) return;
    const events = timelineData.value.events;
    const summary = timelineData.value.overall_summary;
    const subject = articles.value[selectedArticleIndex.value]?.title || '';
    try {
      timelineData.value.isExtending = true;
      const response = await fetch('/api/extendTimeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          direction,
          summary,
          subject
        })
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const newEvents = (data.new_events || []).map(e => ({ ...e, isNew: true }));
      if (direction === 'before') {
        timelineData.value.events = [...newEvents, ...timelineData.value.events];
      } else {
        timelineData.value.events = [...timelineData.value.events, ...newEvents];
      }
      timelineData.value.overall_summary = data.new_summary || summary;
    } catch (error) {
      console.error('Failed to extend timeline:', error);
    } finally {
      timelineData.value.isExtending = false;
    }
  };

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
      const timelineDataRes = await timelineRes.json();
      if (timelineDataRes.events && timelineDataRes.events.length > 0) {
        filtered.push({ title: a.title, content: a.extract });
        timelines.value[a.title] = timelineDataRes;
      }
    }
    return filtered;
  }

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
  };

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

  watch(selectedArticleIndex, (val) => {
    if (onboardingStep.value === 1 && val !== -1) {
      onboardingStep.value = 2;
    }
  });

  function handleRemix() {
    if (onboardingStep.value === 4) {
      onboardingStep.value = 0;
    }
    remixTimeline();
  }

  return {
    showWelcome,
    onboardingStep,
    articles,
    selectedArticleIndex,
    selectedEventIndex,
    timelineData,
    isLoading,
    isRemixing,
    extendDirection,
    timelines,
    isManualRefresh,
    isInitialLoad,
    selectedEvent,
    handleWelcomeClose,
    handleArticleSelect,
    handleEventSelect,
    remixTimeline,
    handleExtend,
    refreshArticles,
    handleRemix
  };
}
