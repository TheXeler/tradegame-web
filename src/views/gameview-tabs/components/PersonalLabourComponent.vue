<template>
  <div class="minigame-overlay">
    <div class="minigame-content">
      <h3>原料加工车间</h3>

      <div class="main-content-wrapper">
        <div class="main-game-area">
          <div class="game-status">
            <div class="status-item">
              <span>原料库存: {{ gameState.rawMaterials }}</span>
            </div>
            <div class="status-item">
              <span>纯净原料: {{ gameState.purifiedMaterials }}</span>
            </div>
            <div class="status-item">
              <span>废料: {{ gameState.scrapMaterials }}</span>
            </div>
            <div class="status-item">
              <span>成品: {{ gameState.products }} / 5</span>
            </div>
          </div>

          <div class="tool-status">
            <div class="tool-item">
              <span>工具热量: {{ gameState.toolHeat }}/5</span>
            </div>
            <div class="tool-item">
              <span>备用工具数量: {{ gameState.backupTool }}/1</span>
            </div>
          </div>

          <div class="game-actions">
            <button
                @click="purify"
                :disabled="gameState.rawMaterials <= 0 || gameState.gameOver"
                class="action-btn purify-btn"
            >
              提纯
            </button>
            <button
                @click="pack"
                :disabled="gameState.purifiedMaterials <= 0 || gameState.gameOver"
                class="action-btn pack-btn"
            >
              打包
            </button>
            <button
                @click="restock"
                :disabled="gameState.products <= 0 || gameState.gameOver"
                class="action-btn restock-btn"
            >
              补货
            </button>
          </div>

          <div v-if="gameState.gameOver" class="game-result">
            <p :class="{ success: gameState.isSuccess }">
              {{ gameState.logs[gameState.logs.length - 1] }}
            </p>
            <button @click="closeMinigame" class="close-btn">关闭</button>
          </div>
        </div>

        <div class="operation-log">
          <h4>操作记录</h4>
          <ul>
            <li v-for="(log, index) in gameState.logs" :key="index">
              {{ log }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {apiKits} from "@/services/api.ts";
import {userGameService} from "@/services/game/user.ts";

const props = defineProps<{
  onClose: () => void
}>()

const gameState = reactive({
  rawMaterials: 5,
  purifiedMaterials: 0,
  scrapMaterials: 0,
  products: 0,
  toolHeat: 0,
  backupTool: 1,
  gameOver: false,
  isSuccess: false,
  logs: [] as string[],
  stateTip: ''
})

const resetGame = () => {
  gameState.rawMaterials = 5
  gameState.purifiedMaterials = 0
  gameState.scrapMaterials = 0
  gameState.products = 0
  gameState.toolHeat = 0
  gameState.backupTool = 1
  gameState.gameOver = false
  gameState.isSuccess = false
  gameState.logs = []
}

resetGame()

const purify = () => {
  if (gameState.rawMaterials <= 0) return

  const result = Math.floor(Math.random() * 5) + 1

  switch (result) {
    case 1:
      gameState.rawMaterials--
      gameState.purifiedMaterials++
      gameState.logs.push(`✔️ 提纯成功，得到1单位纯净原料 (🎲${result})`)
      gameState.stateTip = '✔️ 提纯成功！'
      break
    case 2:
      if (gameState.scrapMaterials > 0) {
        gameState.scrapMaterials--
        gameState.rawMaterials++
        gameState.logs.push(`✔️ 提纯成功，成功再利用1单位废料 (🎲${result})`)
      } else {
        gameState.logs.push(`✔️ 提纯成功，没有废料可供利用 (🎲${result})`)
      }
      gameState.stateTip = '✔️ 提纯成功！'
      break
    default:
      gameState.rawMaterials--
      gameState.scrapMaterials++
      gameState.logs.push(`❌ 提纯失败，得到1单位废料 (🎲${result})`)
      gameState.stateTip = '❌ 提纯失败！'
  }

  coolTools()
  checkGameOver()
}

const pack = () => {
  if (gameState.purifiedMaterials <= 0) return

  gameState.purifiedMaterials--

  const result = Math.floor(Math.random() * 5) + 1

  gameState.toolHeat = result + gameState.toolHeat

  if (gameState.toolHeat >= 5) {
    gameState.logs.push(`❌ 打包失败，工具发生过热熔毁 (${gameState.toolHeat}/5) (🎲${result})`)
    gameState.stateTip = '❌ 打包失败！'
    if (gameState.backupTool >= 1) {
      gameState.toolHeat = 0
      gameState.backupTool--
    }
  } else {
    gameState.products++
    gameState.logs.push(`✔️ 打包成功，完成1单位产品 (🎲${result})`)
    gameState.stateTip = '✔️ 打包成功！'
  }

  checkGameOver()
}

const restock = () => {
  if (gameState.products > 0) {
    gameState.products--
    gameState.scrapMaterials = 0
    gameState.purifiedMaterials = 0
    gameState.rawMaterials = 5
    gameState.logs.push('使用产品补货，恢复为5个原料')
    gameState.stateTip = '✔️ 补货成功！'
  }

  coolTools()
  checkGameOver()
}

const coolTools = () => {
  if (gameState.toolHeat < 5) {
    gameState.toolHeat = Math.max(0, gameState.toolHeat - 1)
  }
}

const checkGameOver = () => {
  if (gameState.products >= 5) {
    gameState.isSuccess = true
    gameState.gameOver = true
    gameState.stateTip = '🎉 工作完成！获得报酬'

    userGameService.updateUserBalance()
    return
  }

  if (gameState.toolHeat >= 5 && gameState.backupTool <= 0) {
    gameState.isSuccess = false
    gameState.gameOver = true
    gameState.stateTip = '❌ 游戏失败：两个工具都烧毁'
    return
  }

  if (gameState.products <= 0 && gameState.rawMaterials <= 0) {
    gameState.isSuccess = false
    gameState.gameOver = true
    gameState.stateTip = '❌ 游戏失败：废料过多且无成品'
  }
}

const closeMinigame = () => {
  resetGame()
  props.onClose()
}
</script>

<style scoped>
.minigame-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.minigame-content {
  background-color: #2c3e50;
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  min-width: 600px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.minigame-content h3 {
  margin-top: 0;
  color: #FFA500;
}

.main-content-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.main-game-area {
  flex: 2;
}

.game-status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
}

.status-item {
  background-color: #34495e;
  padding: 10px;
  border-radius: 5px;
}

.tool-status {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.tool-item {
  background-color: #34495e;
  padding: 10px 20px;
  border-radius: 5px;
}

.game-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  min-width: 80px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.purify-btn {
  background-color: #3498db;
  color: white;
}

.pack-btn {
  background-color: #2ecc71;
  color: white;
}

.restock-btn {
  background-color: #e67e22;
  color: white;
}

.close-btn {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.game-result {
  margin: 20px 0;
}

.game-result .success {
  color: #2ecc71;
  font-size: 1.2em;
  font-weight: bold;
}

.operation-log {
  flex: 1;
  text-align: left;
  background-color: #34495e;
  padding: 15px;
  border-radius: 5px;
  max-width: 24ch;
  min-width: 24ch;
  max-height: 300px;
  overflow-y: auto;
  align-self: flex-start;
}

.operation-log h4 {
  margin-top: 0;
  color: #FFA500;
}

.operation-log ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.operation-log li {
  padding: 5px 0;
  border-bottom: 1px solid #4a5f7a;
}

.operation-log li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .main-content-wrapper {
    flex-direction: column;
  }

  .operation-log {
    align-self: stretch;
  }
}
</style>
