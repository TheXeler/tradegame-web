<template>
  <div class="industry-container">
    <div class="construction-message">
      <h2>🏗️ 产业管理页面施工中</h2>
      <p>我们正在努力开发此功能，请稍后再来查看。</p>
      <p class="completion-text">预计完成时间：敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.industry-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.construction-message {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 500px;
}

.construction-message h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.construction-message p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.completion-text {
  font-style: italic;
  color: #888;
  font-size: 0.9rem;
}
</style>
