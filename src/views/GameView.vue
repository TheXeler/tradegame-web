<template>
  <div class="game-container">
    <div class="game-header">
      <h1>好的不能再好了！股票本网页端</h1>
      <div class="user-info">
        <span>账户余额： {{ balance }}</span>
      </div>
    </div>

    <div class="tab-navigation">
      <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="tab-content">
      <PersonalLabel v-if="activeTab === 'personal'"/>
      <IndustryLabel v-if="activeTab === 'industry'"/>
      <MarketLabel v-if="activeTab === 'market'"/>
      <ProfileLabel v-if="activeTab === 'profile'"/>
      <NewsLabel v-if="activeTab === 'news'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {userGameService} from "@/services/game/user.js"
import PersonalLabel from './gameview-tabs/PersonalLabel.vue'
import IndustryLabel from './gameview-tabs/IndustryLabel.vue'
import MarketLabel from './gameview-tabs/MarketLabel.vue'
import ProfileLabel from './gameview-tabs/ProfileLabel.vue'
import NewsLabel from "./gameview-tabs/NewsLabel.vue"

const router = useRouter()
const balance = ref('')
const activeTab = ref('personal') // 默认激活个人劳动标签页

const tabs = [
  {id: 'news', name: '每日新闻'},
  {id: 'personal', name: '个人劳动'},
  {id: 'industry', name: '产业管理'},
  {id: 'market', name: '交易市场'},
  {id: 'profile', name: '个人信息'}
]

watch(activeTab, (newTab) => {
  try {
    if (newTab === 'personal') {
      userGameService.updateAllUserData()
    } else {
      userGameService.updateUserBalance()
    }
    const interval = setInterval(() => {
      if (userGameService.isValid()) {
        balance.value = userGameService.getBalance()
        clearInterval(interval)
      }
    }, 500)
  } catch (e) {
    router.push('/')
  }
})

onMounted(() => {
  try {
    userGameService.updateUserBalance()
    const interval = setInterval(() => {
      if (userGameService.isValid()) {
        balance.value = userGameService.getBalance()
        clearInterval(interval)
      }
    }, 500)

  } catch (e) {
    router.push('/')
  }
})
</script>

<style scoped>
.game-container {
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.tab-navigation {
  display: flex;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.tab-button {
  flex: 1;
  padding: 15px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #f8f9fa;
}

.tab-button.active {
  color: #2c3e50;
  border-bottom: 3px solid #2c3e50;
  font-weight: 600;
}

/* 标签页内容样式 */
.tab-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  min-height: 400px;
  height: 600px;
  position: relative;
}

.tab-panel h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tab-panel p {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}
</style>
