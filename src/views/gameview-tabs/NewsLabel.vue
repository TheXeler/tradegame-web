<template>
  <div class="news-container">
    <div class="news-sidebar">
      <h3>新闻列表</h3>
      <div class="news-list" ref="newsListRef">
        <div
          v-for="news in newsList"
          :key="news.id"
          :class="['news-item', { active: selectedNews?.id === news.id }]"
          @click="selectNews(news)"
        >
          <div class="news-title">{{ news.title }}</div>
          <div class="news-time">{{ news.time }}</div>
        </div>
      </div>
    </div>

    <div class="news-content">
      <div v-if="hasError" class="error-page">
        <h2>加载失败</h2>
        <p>{{ errorMessage }}</p>
        <button @click="retryFetch" class="retry-button">重新加载</button>
      </div>

      <div v-else-if="selectedNews" class="news-detail">
        <h2>{{ selectedNews.title }}</h2>
        <div class="news-meta">
          <span class="news-time">{{ selectedNews.time }}</span>
        </div>
        <div class="news-body">
          <p v-if="selectedNews.content">{{ selectedNews.content }}</p>
          <p v-else>正在加载新闻内容...</p>
        </div>
      </div>

      <div v-else class="news-placeholder">
        <p>请选择一条新闻查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiKits } from '@/services/api'
import { newsGameService } from '@/services/game/news'

interface NewsItem {
  id: number
  title: string
  time: string
  content?: string
}

const newsList = ref<NewsItem[]>([])
const selectedNews = ref<NewsItem | null>(null)
const newsListRef = ref<HTMLElement | null>(null)
const hasError = ref(false)
const errorMessage = ref('')

const selectNews = async (news: NewsItem) => {
  selectedNews.value = news

  try {
    const data = await apiKits.get("news", "getInfo", {id: news.id})
    selectedNews.value = {
      ...news,
      content: data.content
    }
  } catch (error) {
    console.error('获取新闻详情失败:', error)
  }
}

const fetchNewsList = async () => {
  try {
    hasError.value = false
    await newsGameService.getNewsList()

    const storedNewsList = sessionStorage.getItem('news.list')

    if (storedNewsList) {
      newsList.value = JSON.parse(storedNewsList)
    } else {
      const data = await newsGameService.getNewsList()
      newsList.value = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        time: item.time
      }))
    }

    if (newsList.value.length > 0) {
      await selectNews(newsList.value[0])
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    hasError.value = true
    errorMessage.value = '无法加载新闻列表，请检查网络连接或稍后重试'
  }
}

const retryFetch = () => {
  fetchNewsList()
}

// 组件挂载后获取数据
onMounted(() => {
  fetchNewsList()
})
</script>

<style scoped>
.news-container {
  display: flex;
  height: 100%;
  gap: 20px;
}

.news-sidebar {
  width: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.news-sidebar h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.news-list {
  max-height: 500px;
  overflow-y: auto;
}

.news-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;
}

.news-item:hover {
  background: #e9ecef;
}

.news-item.active {
  background: #dde8f0;
  border-left: 3px solid #2c3e50;
}

.news-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.news-time {
  font-size: 0.85rem;
  color: #666;
}

.news-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.news-detail h2 {
  margin-top: 0;
  color: #2c3e50;
}

.news-meta {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.news-body {
  line-height: 1.6;
  color: #444;
}

.news-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
}

.error-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
}

.error-page h2 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #2980b9;
}
</style>
