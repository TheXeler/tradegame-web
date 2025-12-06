<template>
  <div class="market-container">
    <div class="sidebar-navigation">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['nav-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </div>
    </div>

    <div class="content-area">
      <div v-if="activeTab === 'materials'" class="construction-tab">
        <div class="construction-message">
          <h2>📈 期货交易施工中</h2>
          <p>我们正在努力开发此功能，请稍后再来查看。</p>
          <p class="completion-text">预计完成时间：敬请期待</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'stocks'" class="construction-tab">
        <div class="construction-message">
          <h2>📊 股票交易施工中</h2>
          <p>我们正在努力开发此功能，请稍后再来查看。</p>
          <p class="completion-text">预计完成时间：敬请期待</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'player'" class="player-trading-container">
        <div class="orders-grid">
          <div
            v-for="order in mockOrders"
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <span class="order-id">订单 #{{ order.id }}</span>
              <span class="expiry-time">到期: {{ order.expiry }}</span>
            </div>

            <div class="order-details">
              <div class="material-info">
                <div class="material-image">
                  <!-- 物料图片占位符 -->
                  <div class="image-placeholder"></div>
                </div>
                <div class="material-details">
                  <div class="material-name">{{ order.materialName }}</div>
                  <div class="quantity">数量: {{ order.quantity }}</div>
                </div>
              </div>

              <div class="price-info">
                <div class="amount">金额: ¥{{ order.amount }}</div>
                <div class="parties">
                  <div class="buyer">购入方: {{ order.buyer }}</div>
                  <div class="seller">出售方: {{ order.seller }}</div>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button class="btn btn-primary" @click="openOfferModal('sell', order)">
                出售报价
              </button>
              <button class="btn btn-secondary" @click="openOfferModal('buy', order)">
                购入报价
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报价模态框 -->
    <div v-if="showOfferModal" class="modal-overlay" @click="closeOfferModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ offerType === 'sell' ? '出售报价' : '购入报价' }}</h3>
          <button class="close-button" @click="closeOfferModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitOffer">
            <div class="form-group">
              <label>新报价:</label>
              <input
                type="number"
                v-model="newOfferAmount"
                placeholder="请输入报价金额"
                class="form-control"
              />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeOfferModal">
                取消
              </button>
              <button type="submit" class="btn btn-primary">
                提交报价
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  { id: 'materials', name: '期货' },
  { id: 'stocks', name: '股票' },
  { id: 'player', name: '玩家间交易' }
]

const activeTab = ref('player')

const mockOrders = [
  {
    id: 'ORD001',
    expiry: '2023-12-31',
    materialName: '铁矿石',
    quantity: 100,
    amount: 5000,
    buyer: '玩家A',
    seller: '玩家B'
  },
  {
    id: 'ORD002',
    expiry: '2023-11-30',
    materialName: '原油',
    quantity: 50,
    amount: 7500,
    buyer: '玩家C',
    seller: '玩家D'
  },
  {
    id: 'ORD003',
    expiry: '2023-10-15',
    materialName: '铜',
    quantity: 200,
    amount: 12000,
    buyer: '玩家E',
    seller: '玩家F'
  },
  {
    id: 'ORD004',
    expiry: '2023-09-20',
    materialName: '铝',
    quantity: 150,
    amount: 3000,
    buyer: '玩家G',
    seller: '玩家H'
  }
]

// 报价模态框相关状态
const showOfferModal = ref(false)
const offerType = ref<'sell' | 'buy'>('sell')
const currentOrder = ref<any>(null)
const newOfferAmount = ref<number | null>(null)

// 打开报价模态框
const openOfferModal = (type: 'sell' | 'buy', order: any) => {
  offerType.value = type
  currentOrder.value = order
  showOfferModal.value = true
  newOfferAmount.value = null
}

// 关闭报价模态框
const closeOfferModal = () => {
  showOfferModal.value = false
  currentOrder.value = null
}

// 提交报价 TODO: 实现实际接口调用
const submitOffer = () => {
  // TODO: 调用报价接口
  console.log('提交报价:', {
    orderId: currentOrder.value?.id,
    type: offerType.value,
    amount: newOfferAmount.value
  })

  // 关闭模态框
  closeOfferModal()

  // 显示成功消息 (实际项目中应使用通知组件)
  alert('报价已提交')
}
</script>

<style scoped>
.market-container {
  height: 100%;
  width: 100%;
  display: flex;
}

.sidebar-navigation {
  width: 200px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
}

.nav-item {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #2c3e50;
}

.nav-item.active {
  color: #2c3e50;
  border-left: 3px solid #409eff;
  background-color: white;
  font-weight: 500;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.construction-tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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

.completion-text {
  font-style: italic;
  color: #888;
  font-size: 0.9rem;
}

/* 玩家交易样式 */
.player-trading-container {
  flex: 1;
  padding: 20px;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.order-id {
  font-weight: bold;
  color: #2c3e50;
}

.expiry-time {
  color: #888;
}

.order-details {
  margin-bottom: 16px;
}

.material-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.material-image .image-placeholder {
  width: 50px;
  height: 50px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #999;
  font-size: 12px;
}

.material-details {
  flex: 1;
}

.material-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.quantity {
  color: #666;
  font-size: 14px;
}

.price-info .amount {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.parties {
  font-size: 13px;
  color: #666;
}

.parties .buyer,
.parties .seller {
  margin-bottom: 2px;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-primary:hover {
  background-color: #337ecc;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #409eff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .market-container {
    flex-direction: column;
  }

  .sidebar-navigation {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 0;
    display: flex;
  }

  .nav-item {
    flex: 1;
    text-align: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .nav-item.active {
    border-left: none;
    border-bottom: 3px solid #409eff;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }
}
</style>
