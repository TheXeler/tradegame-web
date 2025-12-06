<template>
  <div class="market-contract-container">
    <!-- 股票市场组件 -->
    <div v-if="isStockMarket" class="market-list">
      <div
        v-for="stock in stocks"
        :key="stock.id"
        class="market-item"
        @click="selectStock(stock)"
      >
        <div class="item-header">
          <div class="logo-placeholder">
            <img
              v-if="stock.logo"
              :src="stock.logo"
              :alt="stock.name"
              class="company-logo"
            >
            <div v-else class="logo-placeholder-text">{{ stock.name.charAt(0) }}</div>
          </div>
          <div class="item-info">
            <div class="item-name">{{ stock.name }}</div>
            <div class="item-code">{{ stock.code }}</div>
          </div>
        </div>

        <div class="price-info" :class="getPriceChangeClass(stock.changePercent)">
          <div class="current-price">{{ stock.currentPrice.toFixed(2) }} 元</div>
          <div class="price-change">
            <span>{{ stock.change > 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}</span>
            <span>{{ stock.change > 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 材料市场组件 -->
    <div v-else class="market-list">
      <div
        v-for="material in materials"
        :key="material.type"
        class="market-item"
        @click="selectMaterial(material)"
      >
        <div class="item-header">
          <div class="logo-placeholder">
            <div class="material-icon">📦</div>
          </div>
          <div class="item-info">
            <div class="item-name">{{ material.name }}</div>
            <div class="item-type">{{ material.type }}</div>
          </div>
        </div>

        <div class="price-info" :class="getPriceChangeClass(material.changePercent)">
          <div class="current-price">{{ material.currentPrice.toFixed(2) }} 元</div>
          <div class="price-change">
            <span>{{ material.change > 0 ? '+' : '' }}{{ material.change.toFixed(2) }}</span>
            <span>{{ material.change > 0 ? '+' : '' }}{{ material.changePercent.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情面板 -->
    <div v-if="selectedItem" class="detail-panel">
      <div class="detail-header">
        <div class="logo-placeholder large">
          <img
            v-if="isStockMarket && selectedItem.logo"
            :src="selectedItem.logo"
            :alt="selectedItem.name"
            class="company-logo large"
          >
          <div v-else-if="isStockMarket" class="logo-placeholder-text large">
            {{ selectedItem.name.charAt(0) }}
          </div>
          <div v-else class="material-icon large">📦</div>
        </div>
        <div class="header-info">
          <h2>{{ selectedItem.name }}</h2>
          <div v-if="isStockMarket" class="subtitle">{{ selectedItem.code }}</div>
          <div v-else class="subtitle">{{ selectedItem.type }}</div>
        </div>
      </div>

      <div
        class="price-display"
        :class="getPriceChangeClass(selectedItem.changePercent)"
      >
        <div class="current-price-large">{{ selectedItem.currentPrice.toFixed(2) }} 元</div>
        <div class="price-change-details">
          <span class="change-amount">
            {{ selectedItem.change > 0 ? '+' : '' }}{{ selectedItem.change.toFixed(2) }}
          </span>
          <span class="change-percent">
            {{ selectedItem.change > 0 ? '+' : '' }}{{ selectedItem.changePercent.toFixed(2) }}%
          </span>
        </div>
      </div>

      <div class="chart-area">
        <!-- 图表区域留空，待后续实现 -->
        <div class="chart-placeholder">
          <div class="chart-title">价格走势图</div>
          <div class="chart-content">
            <!-- 这里将放置图表组件 -->
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn buy-btn">买入</button>
        <button class="btn sell-btn">卖出</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { marketService } from '@/services/game/market';

// 定义股票和材料的数据结构
interface Stock {
  id: number;
  name: string;
  code: string;
  logo?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  history?: any[];
}

interface Material {
  type: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  history?: any[];
}

// 组件属性
const props = defineProps<{
  isStockMarket: boolean;
}>();

// 响应式数据
const stocks = ref<Stock[]>([]);
const materials = ref<Material[]>([]);
const selectedItem = ref<Stock | Material | null>(null);

// 获取价格变化的类名（红色/绿色）
const getPriceChangeClass = (changePercent: number) => {
  return {
    'price-up': changePercent > 0,
    'price-down': changePercent < 0,
    'price-neutral': changePercent === 0
  };
};

// 选择股票
const selectStock = (stock: Stock) => {
  selectedItem.value = stock;
  // TODO: 加载详细历史数据
};

// 选择材料
const selectMaterial = (material: Material) => {
  selectedItem.value = material;
  // TODO: 加载详细历史数据
};

// 加载股票列表
const loadStocks = async () => {
  try {
    const response = await marketService.getStockList();
    // 模拟数据 - 实际应该从response.data获取
    stocks.value = [
      {
        id: 1,
        name: "阿里巴巴",
        code: "09988.HK",
        currentPrice: 95.2,
        change: -0.11,
        changePercent: -1.14
      },
      {
        id: 2,
        name: "腾讯控股",
        code: "00700.HK",
        currentPrice: 320.5,
        change: 2.3,
        changePercent: 0.72
      },
      {
        id: 3,
        name: "美团",
        code: "03690.HK",
        currentPrice: 125.8,
        change: -1.2,
        changePercent: -0.95
      }
    ];
  } catch (error) {
    console.error('加载股票列表失败:', error);
  }
};

// 加载材料列表
const loadMaterials = async () => {
  try {
    const response = await marketService.getMaterialList();
    // 模拟数据 - 实际应该从response.data获取
    materials.value = [
      {
        type: "IRON",
        name: "铁矿石",
        currentPrice: 750.0,
        change: 15.0,
        changePercent: 2.04
      },
      {
        type: "OIL",
        name: "原油",
        currentPrice: 520.5,
        change: -8.2,
        changePercent: -1.55
      },
      {
        type: "COPPER",
        name: "铜",
        currentPrice: 680.3,
        change: 5.7,
        changePercent: 0.84
      }
    ];
  } catch (error) {
    console.error('加载材料列表失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  if (props.isStockMarket) {
    loadStocks();
  } else {
    loadMaterials();
  }
});
</script>

<style scoped>
.market-contract-container {
  display: flex;
  height: 100%;
  gap: 20px;
}

.market-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.market-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.market-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-placeholder.large {
  width: 60px;
  height: 60px;
}

.logo-placeholder-text {
  font-weight: bold;
  color: #666;
}

.logo-placeholder-text.large {
  font-size: 24px;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-logo.large {
  width: 60px;
  height: 60px;
}

.material-icon {
  font-size: 20px;
}

.material-icon.large {
  font-size: 30px;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-code, .item-type {
  font-size: 12px;
  color: #888;
}

.price-info {
  text-align: right;
}

.current-price {
  font-weight: 500;
  font-size: 16px;
}

.price-change {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.price-up {
  color: #e74c3c;
}

.price-down {
  color: #2ecc71;
}

.price-neutral {
  color: #95a5a6;
}

.detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header-info h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.price-display {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-price-large {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.price-change-details {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 18px;
}

.change-amount, .change-percent {
  font-weight: 500;
}

.chart-area {
  flex: 1;
  margin: 20px 0;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #2c3e50;
}

.chart-content {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-btn {
  background-color: #2ecc71;
  color: white;
}

.sell-btn {
  background-color: #e74c3c;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .market-contract-container {
    flex-direction: column;
  }

  .market-list {
    max-height: 300px;
  }
}
</style>
