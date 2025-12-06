<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-pattern"></div>

    <!-- 主登录卡片 -->
    <div class="login-card">
      <div class="game-logo">
        <img src="@/assets/logo.png" alt="游戏Logo" class="logo-image"/>
      </div>

      <div class="login-form">
        <div class="form-group">
          <label for="username">
            <span class="icon">👤</span> 用户名
          </label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="请输入用户名"
              @keyup.enter="handleLogin"
          />
          <div class="input-hint">3-20个字符，支持中英文、数字</div>
        </div>

        <div class="form-group">
          <label for="password">
            <span class="icon">🔒</span> 密码
          </label>
          <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              @keyup.enter="handleLogin"
          />
          <button
              class="password-toggle"
              @click="showPassword = !showPassword"
              type="button"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
          <div class="input-hint">至少6位字符，建议包含字母和数字</div>
        </div>

        <!-- 记住我选项 -->
        <div class="remember-me">
          <input
              type="checkbox"
              id="remember"
              v-model="rememberMe"
          />
          <label for="remember">记住登录状态</label>
        </div>

        <!-- 按钮组 -->
        <div class="button-group">
          <button
              class="btn btn-primary"
              @click="handleLogin"
              :disabled="!canLogin"
          >
            <span class="btn-icon">🚀</span>
            登录交易
          </button>

          <button
              class="btn btn-primary"
              @click="handleRegister"
          >
            <span class="btn-icon">📝</span>
            注册账户
          </button>
        </div>

        <!-- 状态消息 -->
        <div v-if="message" class="status-message" :class="messageType">
          {{ message }}
        </div>

        <!-- 底部信息 -->
        <div class="footer-info">
          <div class="tips">
            💡 提示：{{ currentTip }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import tipMessages from '@/assets/tips.json'
import {authService} from "@/services/auth.ts"

const router = useRouter()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const message = ref('')
const messageType = ref('info') // 'info', 'success', 'error'

const currentTip = computed(() => {
  return tipMessages[Math.floor(Math.random() * tipMessages.length)]
})

const canLogin = computed(() => {
  return username.value.trim().length >= 3 &&
      password.value.length >= 6
})

const handleLogin = async () => {
  if (!canLogin.value) {
    showMessage('请输入有效的用户名和密码', 'error')
    return
  }

  if (rememberMe.value) {
    localStorage.setItem('rememberMe', 'true')
  } else {
    localStorage.removeItem('rememberMe')
  }

  showMessage('正在验证身份...', 'info')

  try {
    const data = await authService.login(username.value, password.value)

    if (data.token && data.token != "") {
      showMessage('登录成功！跳转中...', 'success')
      setTimeout(() => {
        router.push('/game')
      }, 1000)
    } else {
      showMessage(data.message || '登录失败', 'error')
    }
  } catch (error) {
    showMessage('网络错误，请稍后重试', 'error')
  }
}

const handleRegister = async () => {
  if (!username.value || !password.value) {
    showMessage('请先填写用户名和密码', 'error')
    return
  }

  showMessage('正在注册账户...', 'info')

  try {
    const data = await authService.register(username.value, password.value)

    if (data.token && data.token != "") {
      showMessage('注册成功！跳转中...', 'success')
      setTimeout(() => {
        router.push('/game')
      }, 1000)
    } else {
      showMessage(data.message || '注册失败', 'error')
    }
  } catch (error) {
    showMessage('网络错误，请稍后重试', 'error')
  }
}

// 显示消息
const showMessage = (text: string, type: 'info' | 'success' | 'error') => {
  message.value = text
  messageType.value = type

  // 3秒后自动清除消息
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 检查是否已有登录状态
const checkExistingLogin = () => {
  const savedUser = localStorage.getItem('stockGame_user')
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      username.value = user.username
      rememberMe.value = true
      showMessage(`欢迎回来，${user.username}！`, 'info')
    } catch (e) {
      // 解析失败，忽略
    }
  }
}

// 页面加载时检查登录状态
checkExistingLogin()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff9c4 0%, #ffeb3b 50%, #fdd835 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 235, 59, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(253, 216, 53, 0.1) 0%, transparent 50%);
  z-index: 0;
}

.login-card {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 235, 59, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2),
  0 0 100px rgba(255, 235, 59, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo-image {
  max-width: 100%;
  height: auto;
  max-height: 240px;
  object-fit: contain;
}


@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.login-form {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group label {
  display: block;
  color: #5d4037;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group label .icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.form-group input {
  width: 100%;
  padding: 14px 15px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #5d4037;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.form-group input::placeholder {
  color: rgba(93, 64, 55, 0.6);
}

.input-hint {
  color: rgba(93, 64, 55, 0.7);
  font-size: 0.8rem;
  margin-top: 5px;
  padding-left: 5px;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 40px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #fff;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me input {
  margin-right: 10px;
  transform: scale(1.2);
}

.remember-me label {
  color: #5d4037;
  font-size: 0.9rem;
  cursor: pointer;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: linear-gradient(45deg, #ffc107, #ff9800);
  color: #5d4037;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(45deg, #ff9800, #ffc107);
  box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}


.btn-icon {
  font-size: 1.3rem;
}

.status-message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.status-message.info {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.status-message.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-message.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.footer-info {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tips {
  text-align: center;
  color: #5d4037;
  font-size: 0.85rem;
  font-style: italic;
}

@media (max-width: 600px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }

  .game-title h1 {
    font-size: 2.5rem;
  }

  .button-group {
    grid-template-columns: 1fr;
  }

  .stats {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>