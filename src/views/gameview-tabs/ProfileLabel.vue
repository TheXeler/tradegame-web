<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar-placeholder">
          <span class="avatar-icon">👤</span>
        </div>
        <div class="user-basic-info">
          <h2>{{ profileData.username }}</h2>
          <p class="user-role">普通用户</p>
        </div>
      </div>
      <div class="edit-profile-btn">
        <button @click="editProfile">编辑资料</button>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-value">{{ profileData.balance }}</div>
        <div class="stat-label">账户余额</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ profileData.summary }}</div>
        <div class="stat-label">总资产</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ profileData.rank }}</div>
        <div class="stat-label">当前排名</div>
      </div>
    </div>

    <div class="profile-details">
      <h3>个人信息</h3>
      <div class="detail-list">
        <div class="detail-item">
          <span class="detail-label">用户名:</span>
          <span class="detail-value">{{ profileData.username }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">注册时间:</span>
          <span class="detail-value">{{ profileData.registerDate }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">最后登录:</span>
          <span class="detail-value">{{ profileData.lastLogin }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">邮箱:</span>
          <span class="detail-value">{{ profileData.email }}</span>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <button class="action-btn" @click="changePassword">修改密码</button>
      <button class="action-btn" @click="accountSettings">账户设置</button>
      <button class="action-btn danger" @click="logout">退出登录</button>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showChangePasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h3>修改密码</h3>
        <form @submit.prevent="handlePasswordChange">
          <div class="form-group">
            <label>旧密码:</label>
            <input
              type="password"
              v-model="passwordForm.oldPassword"
              required
            />
          </div>
          <div class="form-group">
            <label>新密码:</label>
            <input
              type="password"
              v-model="passwordForm.newPassword"
              required
            />
          </div>
          <div class="form-group">
            <label>确认新密码:</label>
            <input
              type="password"
              v-model="passwordForm.confirmPassword"
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeChangePasswordModal" class="cancel-btn">取消</button>
            <button type="submit" class="submit-btn">确认修改</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {authService} from "@/services/auth.ts"
import {userGameService} from "@/services/game/user.js";

const router = useRouter()
const showChangePasswordModal = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  profileData.value.balance = userGameService.getBalance()
})

const profileData = ref({
  username: authService.getUsername(),
  balance: "0",
  summary: "24",
  rank: "#128",
  registerDate: "2023-05-15",
  lastLogin: "2024-01-15 14:30",
  email: "user@example.com"
})

const editProfile = () => {
  // TODO: 实现编辑资料功能
}

const changePassword = () => {
  // 打开修改密码模态框
  showChangePasswordModal.value = true
  // 清空表单
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false
}

const handlePasswordChange = async () => {
  // 验证新密码和确认密码是否一致
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('新密码和确认密码不一致')
    return
  }

  try {
    // 使用旧密码重新登录以获取新的token
    const loginResult = await authService.login(profileData.value.username, passwordForm.value.oldPassword)

    if (loginResult && loginResult.token) {
      // 使用新token调用修改密码接口
      await authService.changePassword(profileData.value.username, passwordForm.value.newPassword)

      // 关闭模态框
      closeChangePasswordModal()

      alert('密码修改成功，请重新登录')

      // 退出登录并跳转到登录页
      authService.logout()
      router.push('/login')
    } else {
      alert('旧密码错误')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

const accountSettings = () => {
  // TODO: 实现账户设置功能
}

const logout = () => {
  authService.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.user-basic-info h2 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-role {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.edit-profile-btn button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-profile-btn button:hover {
  background-color: #337ecc;
}

.profile-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.profile-details h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.detail-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.detail-label {
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
}

.profile-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #333;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.action-btn.danger {
  background-color: #f56c6c;
  color: white;
}

.action-btn.danger:hover {
  background-color: #e45656;
}

/* 修改密码模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.submit-btn {
  background-color: #409eff;
  color: white;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn:hover {
  background-color: #337ecc;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .detail-list {
    grid-template-columns: 1fr;
  }

  .profile-stats {
    flex-direction: column;
    gap: 20px;
  }

  .profile-actions {
    flex-direction: column;
  }
}
</style>
