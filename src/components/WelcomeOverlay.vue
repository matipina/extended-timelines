<template>
  <div class="welcome-overlay">
    <div class="welcome-modal">
      <h2>Extended Timelines</h2>
      <p>
        <strong>Extended Timelines</strong> is an interactive, AI-powered app that explores the concept of non-linear time and alternate histories. By fetching random Wikipedia articles, it uses generative AI to create, remix, and extend timelines—revealing unexpected connections and possibilities. Each timeline is a unique, AI-generated narrative, letting you explore alternate versions of history and knowledge.<br><br>
        <ul>
          <li>Browse randomly selected Wikipedia articles, or refresh the list to get a new batch.</li>
          <li>Select an article to generate a timeline based on its historical information.</li>
          <li><b>Remix</b>: Instantly generate an alternative timeline for the same article, reordering and reinterpreting events using AI.</li>
          <li><b>Extend Past/Future</b>: Add more events before or after the current timeline, letting AI imagine what else could have happened.</li>
        </ul>
      </p>
      <button class="welcome-btn" @click="$emit('close')">Try it out</button>
    </div>
  </div>
</template>

<script setup>
// No logic needed, emits 'close' when button is clicked
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  z-index: 1000;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(18, 18, 18, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(16px) saturate(1.2);
}
.welcome-modal {
  background: rgba(35, 39, 47, 0.85);
  color: #e0e0e0;
  border-radius: 22px;
  box-shadow: 0 8px 32px #000a;
  padding: 48px 56px 40px 56px;
  max-width: 700px;
  width: 90vw;
  text-align: center;
  font-size: 1.18rem;
  border: 1.5px solid #333;
  backdrop-filter: blur(24px) saturate(1.3);
}
.welcome-modal h2 {
  font-size: 2.3rem;
  margin-bottom: 22px;
  color: #7ecfff;
}
.welcome-modal ul {
  text-align: left;
  margin: 0 0 0 1.2em;
  padding: 0;
  font-size: 1.08rem;
}
.welcome-modal li {
  margin-bottom: 0.7em;
}
.welcome-btn {
  margin-top: 32px;
  padding: 14px 38px;
  background: #7ecfff;
  color: #181c20;
  border: none;
  border-radius: 50px;
  font-size: 1.18rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.welcome-btn:hover {
  background: #4db8e6;
}
</style>
