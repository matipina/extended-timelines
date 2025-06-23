<template>
    <div class="timeline-container">
        <div class="summary-box">
            <p>{{ currentSummary }}</p>
        </div>

        <div class="timeline-navigation">
            <div class="scroll-arrow left" :class="{ visible: canScrollLeft }" @click="scroll(-200)">
                &#x2190;
            </div>
            <div class="scroll-arrow right" :class="{ visible: canScrollRight }" @click="scroll(200)">
                &#x2192;
            </div>

            <div class="timeline-scroll-wrapper" ref="scrollWrapper" @scroll="updateScrollState">
                <div class="timeline" :style="{ gridTemplateColumns: `repeat(${events.length}, 1fr)` }">
                    <div v-for="(event, index) in events" :key="index" class="event-point-wrapper"
                        @click="handleEventClick(index)">
                        <div class="event-date">{{ event.date }}</div>
                        <div class="event-marker" :class="{ selected: selectedEventIndex === index }"></div>
                        <div class="event-summary">{{ event.summary }}</div>
                    </div>
                </div>
            </div>
        </div>

        <button class="remix-button" @click="remixTimeline">Remix History ↻</button>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

const props = defineProps({
    data: Object,
});

const events = ref([]);
const currentSummary = ref("");
const selectedEventIndex = ref(-1);

const scrollWrapper = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const updateScrollState = () => {
    const el = scrollWrapper.value;
    if (!el) return;
    canScrollLeft.value = el.scrollLeft > 0;
    canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
};

const scroll = (amount) => {
    scrollWrapper.value?.scrollBy({ left: amount, behavior: "smooth" });
};

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            events.value = [...newData.events];
            currentSummary.value = newData.overall_summary;
            selectedEventIndex.value = -1;
            setTimeout(updateScrollState, 100);
        }
    },
    { immediate: true }
);

onMounted(() => {
    updateScrollState();
});

const handleEventClick = (index) => {
    if (selectedEventIndex.value === index) {
        selectedEventIndex.value = -1;
        currentSummary.value = props.data.overall_summary;
    } else {
        selectedEventIndex.value = index;
        currentSummary.value = events.value[index].details;
    }
};

const remixTimeline = async () => {
    // Simple shuffle algorithm
    for (let i = events.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [events.value[i], events.value[j]] = [events.value[j], events.value[i]];
    }
    selectedEventIndex.value = -1;

    const shuffledSummaries = events.value.map((e) => e.summary).join(", ");

    try {
        // Call the new remix API endpoint
        const response = await fetch("/api/remixTimeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shuffledSummaries }),
        });
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        currentSummary.value = data.summary;
    } catch (error) {
        console.error("Failed to remix timeline:", error);
        currentSummary.value = "An error occurred while remixing history.";
    }
};
</script>

<style scoped>
/* --- Main Container & Summary --- */
.timeline-container {
    overflow: hidden;
    padding: 20px;
    background-color: #f9f9f9;
    border-top: none;
    border-radius: 0 0 8px 8px;
}

.summary-box {
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 20px;
    min-height: 100px;
    color: #555;
}

/* --- Timeline Navigation & Scrolling --- */
.timeline-navigation {
    position: relative;
}

.timeline-scroll-wrapper {
    overflow-x: auto;
    padding: 40px 0;
    /* Gives space for text above/below */
    margin: -20px 0;
}

.timeline-scroll-wrapper::-webkit-scrollbar {
    height: 8px;
}

.timeline-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
}

/* --- The Timeline Itself (Using CSS Grid) --- */
.timeline {
    position: relative;
    display: grid;
    align-items: center;
}

.timeline::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #ccc;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
}

/* --- Event Points & Summaries (Updated) --- */
.event-point-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

/* FIX: New styles for the vertical line marker */
.event-marker {
    width: 2px;
    height: 20px;
    background-color: #aaa;
    transition: all 0.2s ease;
    z-index: 1;
}

.event-point-wrapper:hover .event-marker {
    background-color: #333;
}

.event-marker.selected {
    background-color: #4a90e2;
    height: 30px;
    /* Grow taller when selected */
}

/* FIX: New styles for the date */
.event-date {
    font-weight: 600;
    font-size: 1rem;
    color: #333;
    margin-bottom: 10px;
}

/* FIX: Updated styles for the summary */
.event-summary {
    margin-top: 10px;
    width: 150px;
    font-size: 0.9rem;
    color: #666;
    white-space: normal;
    text-align: center;
}

/* --- Scroll Arrows --- */
.scroll-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    color: #aaa;
    cursor: pointer;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
    user-select: none;
}

.scroll-arrow.visible {
    opacity: 1;
}

.scroll-arrow.left {
    left: -10px;
}

.scroll-arrow.right {
    right: -10px;
}

/* --- Remix Button --- */
.remix-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    border: none;
    background-color: #d9534f;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
}

.remix-button:hover {
    background-color: #c9302c;
}
</style>