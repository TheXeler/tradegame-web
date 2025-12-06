<template>
  <div class="personal-container">
    <button class="work-button" @click="handleWork">
      🔨 劳动
    </button>

    <PersonalLabourComponent v-if="showMinigame" @close="closeMinigame" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PersonalLabourComponent from './components/PersonalLabourComponent.vue'

// 控制小游戏界面显示状态
const showMinigame = ref(false)

const handleWork = () => {
  showMinigame.value = true
}

const closeMinigame = () => {
  showMinigame.value = false
}
</script>

<style scoped>
.personal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  position: relative;
}

.work-button {
  background-color: #FFA500;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.work-button:hover {
  background-color: #FF8C00;
}

.work-button:active {
  transform: scale(0.98);
}
</style>
