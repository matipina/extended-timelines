<template>
  <div class="welcome-overlay">
    <div class="welcome-modal">
      <h2>Welcome to Extended Timelines!</h2>
      <p>
        <strong>Extended Timelines</strong> is an interactive, AI-powered app that generates, explores, and remixes historical timelines for Wikipedia articles.<br><br>
        <ul>
          <li>Browse random Wikipedia articles with rich, AI-generated timelines.</li>
          <li>Click events to explore details and summaries.</li>
          <li>Use <b>Remix</b> to generate alternative timelines, or <b>Extend Past/Future</b> to add more events.</li>
        </ul>
        <br>
        Click below to get started!
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
