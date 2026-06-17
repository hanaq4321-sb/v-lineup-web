<script setup>
import { userRegisterServie, getUserInfoService, getUserCountByEmailService, loginService } from '@/api/user'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Upload, User, Message, Operation, SwitchButton, ArrowRight, Right } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginDialogStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import MapPointsEdit from './user/mapPointsEdit.vue'
const router = useRouter()

//#region 响应处理
const registerRequest = async (username, password, email) => {
  let result = await userRegisterServie(username, password, email)
  if (result.code == 0) {
    ElMessage.success('注册成功，请登录')
    loginModel.value = 'username'
  } else {
    console.log(result.msg)
    ElMessage.error('注册失败')
  }
}
//#endregion

// 搜索
const search = ref('')

//#region 头像动画控制
const avatarHover = () => {
  const box = document.querySelector('.nav-avatar')
  if (!box.classList.contains('nav-avatar-anime1')) {
    if (box.classList.contains('nav-avatar-anime2')) {
      box.classList.remove('nav-avatar-anime2')
    }
    box.classList.add('nav-avatar-anime1')
  }
}
const avatarBlur = () => {
  const box = document.querySelector('.nav-avatar')
  if (!box.classList.contains('nav-avatar-anime2')) {
    if (box.classList.contains('nav-avatar-anime1')) {
      box.classList.remove('nav-avatar-anime1')
    }
    box.classList.add('nav-avatar-anime2')
  }
}
const popoverEnter = () => {
  const box = document.querySelector('.avatar-popover-style')
  if (box.classList.contains('popover-style-leave')) {
    box.classList.remove('popover-style-leave')
  }
  box.classList.add('popover-style-enter')
}
const popoverLeave = () => {
  // 因为popover动画位置会根据头像的位置变化，所以在头像动画改变头像位置后重新给popover定位
  const boxP = document.querySelector('.avatar-popover-style')
  if (boxP.classList.contains('popover-style-enter')) {
    boxP.classList.remove('popover-style-enter')
  }
  boxP.classList.add('popover-style-leave')
}
//#endregion

//#region 登录对话框
const loginDialogStore = useLoginDialogStore()
const { loginDialogVisible } = storeToRefs(loginDialogStore)
const loginFormRef = ref(),
  sendVerifyCodeRef = ref(null),
  isSendVerifyCode = ref(true),
  loginModel = ref('username')
const loginForm = ref({
  username: null,
  password: null,
  checkPassword: null,
  email: null,
  verifyCode: null,
  remember: false,
})
watch(
  () => loginForm.value.email,
  (newValue) => {
    if (newValue.email != '') {
      isSendVerifyCode.value = false
      // FIXME elbutton ref无法修改style
      buttonColor = '#fff'
    } else {
      isSendVerifyCode.value = true
      buttonColor = null
    }
  },
)
watch(
  () => loginModel.value,
  () => {
    console.log('changge')
    loginForm.value = {
      username: '',
      password: '',
      email: '',
      verifyCode: '',
      remember: false,
    }
  },
)
const validateCheckPwd = (rule, value, callback) => {
  if (value == '') {
    callback(new Error('请确认密码'))
  } else if (value != loginForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
let usernameValid = '',
  emailValid = '' // 如果格式验证有信息，即格式验证不通过，则不进行重复验证
const validateUserName = (rule, value, callback) => {
  if (value == '') {
    usernameValid = '用户名不能为空'
    callback(new Error(usernameValid))
  } else if (value.length > 15 || value.length < 5) {
    usernameValid = '用户名长度在5~15位之间'
    callback(new Error(usernameValid))
  } else {
    usernameValid = ''
    callback()
  }
}
const validateUserNameRepeat = async (rule, value, callback) => {
  if (usernameValid != '') callback(new Error(usernameValid))
  else {
    if (loginModel.value == 'register') {
      const result = await getUserInfoService(loginForm.value.username)
      if (result.code == 0) {
        if (result.data == null) callback()
        else callback(new Error('用户名已存在'))
      } else {
        console.log(result.msg)
        callback(new Error('服务异常'))
      }
    } else {
      callback()
    }
  }
}
const validateEmail = (rule, value, callback) => {
  const pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (value == '') {
    emailValid = '请输入邮箱'
    callback(new Error(emailValid))
  } else if (!pattern.test(value)) {
    emailValid = '邮箱格式错误'
    callback(new Error(emailValid))
  } else {
    emailValid = ''
    callback()
  }
}
const validateEmailRepeat = async (rule, value, callback) => {
  if (emailValid != '') callback(new Error(emailValid))
  else {
    if (loginModel.value == 'register') {
      const result = await getUserCountByEmailService(loginForm.value.email)
      if (result.code == 0) {
        if (result.data == 0) callback()
        else callback(new Error('邮箱已存在'))
      } else {
        console.log(result.msg)
        callback(new Error('服务异常'))
      }
    } else {
      callback()
    }
  }
}
const loginFormRules = ref({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { validator: validateUserName, trigger: 'change' },
    { validator: validateUserNameRepeat, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
    { min: 6, max: 15, message: '密码长度在6~15之间', trigger: 'change' },
  ],
  checkPassword: [{ validator: validateCheckPwd, trigger: 'change' }],
  email: [
    { validator: validateEmail, trigger: 'change' },
    { validator: validateEmailRepeat, trigger: 'blur' },
  ],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'change' }],
})
let buttonColor = null
const loginSwitch = (e, index) => {
  e.target.style.color = '#4abce2'
  let sibling
  if (index == 2) {
    sibling = e.target.previousSibling.previousSibling
    loginModel.value = 'email'
  }
  if (index == 1) {
    sibling = e.target.nextSibling.nextSibling
    loginModel.value = 'username'
  }
  sibling.style.color = '#fff'
}
// 按钮组
const login = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const result = await loginService(loginForm.value.username, loginForm.value.password)
      if (result.code == 0) {
        ElMessage.success('登陆成功')
        loginDialogVisible.value = false
      } else {
        ElMessage.error(result.msg)
      }
    }
  })
}
const register = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      registerRequest(loginForm.value.username, loginForm.value.password, loginForm.value.email)
    }
  })
}
const isSendingVerifyCode = ref(false)
const sendVerifyCode = (formEl) => {
  if (!formEl) return
  formEl.validateField(['email'], (valid) => {
    if (valid) {
      console.log('submit')
      isSendingVerifyCode.value = true
      setTimeout(() => {
        isSendingVerifyCode.value = false
        ElMessage.success('发送成功')
      }, 2000)
    } else {
      console.log('no')
    }
  })
}
//#endregion

//#region 上传选择对话框
const uploadDialogVisible = ref(false)
const uploadSelect = (type) => {
  if (type == 'skill') router.push('/editor')
  else if (type == 'penetrate') router.push('/penetrate')
  else if (type == 'point') {
    // TODO admin判断
    router.push('/pointsEdit')
  }
  uploadDialogVisible.value = false
}
//#endregion
</script>
<template>
  <el-container>
    <el-header>
      <!-- Logo -->
      <img class="logo" src="../assets/logo.png" />
      <!-- 导航栏 -->
      <div class="navigation">
        <!-- string类型不需要冒号，其他类型需要 -->
        <el-menu
          router
          default-active="/"
          mode="horizontal"
          :ellipsis="false"
          background-color="#1a1a1a"
          text-color="#fff"
          active-text-color="#fd4453"
        >
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="/lineup">LineUp</el-menu-item>
          <el-menu-item index="/editor">社区</el-menu-item>
          <el-menu-item index="/penetrate">穿点</el-menu-item>
          <el-menu-item index="/pointsEdit">地图</el-menu-item>
        </el-menu>
        <el-input v-model="search" placeholder="搜索道具" :prefix-icon="Search"></el-input>
      </div>
      <!-- 用户 -->
      <div class="user">
        <!-- 头像弹出框 -->
        <!-- 通过弹出框消失动画来触发头像动画，这样能让两个组件的blur逻辑相同 -->
        <el-popover
          placement="bottom-start"
          :width="300"
          trigger="hover"
          :show-arrow="false"
          popper-class="avatar-popover-style"
          @before-enter="popoverEnter"
          @before-leave="(avatarBlur(), popoverLeave())"
        >
          <template #reference>
            <img class="nav-avatar" src="../assets/avatar.jpg" @mouseenter="avatarHover" />
          </template>
          <div class="avatar-popover">
            <p class="avatar-name"><strong>takamiyamio</strong></p>
            <el-row>
              <el-col :span="8">
                <p class="avatar-num"><strong>20</strong></p>
                <p><small>投稿数量</small></p>
              </el-col>
              <el-col :span="8">
                <p class="avatar-num"><strong>20</strong></p>
                <p><small>采纳数量</small></p>
              </el-col>
              <el-col :span="8">
                <p class="avatar-num"><strong>20</strong></p>
                <p><small>积分</small></p>
              </el-col>
            </el-row>
            <div class="avatar-button">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="avatar-button">
              <el-icon><Operation /></el-icon>
              <span>账户管理</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="avatar-button">
              <el-icon><Message /></el-icon>
              <span>系统消息</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <hr class="avatar-divider" />
            <div class="avatar-button">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </el-popover>
        <el-button type="success" @click="loginDialogVisible = true">登入</el-button>
        <el-button type="danger" @click="uploadDialogVisible = true" :icon="Upload">投稿</el-button>
      </div>
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive include="mapPointsEdit">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </el-main>
    <!-- 登录对话框 -->
    <el-dialog class="login-dialog" title="" v-model="loginDialogVisible" width="500" center>
      <div
        v-if="loginModel == 'username' || loginModel == 'email'"
        class="default-text"
        style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px"
      >
        <div class="switch-text" @click="loginSwitch($event, 1)">账号登录</div>
        <div style="color: #4c4d4f">&ensp;&ensp;|&ensp;&ensp;</div>
        <div class="switch-text" @click="loginSwitch($event, 2)">邮箱登录</div>
      </div>
      <div v-else-if="loginModel == 'forgetPassword'">
        <div class="default-text" style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px">找回密码</div>
      </div>
      <div v-else-if="loginModel == 'register'">
        <div class="default-text" style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px">注册</div>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" status-icon>
        <div v-if="loginModel == 'username'">
          <el-form-item prop="username">
            <el-input class="login-first-input" v-model="loginForm.username" placeholder="请输入用户名" size="large">
              <template #prepend><div class="input-prefix">账号</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="login-last-input" v-model="loginForm.password" placeholder="请输入密码" type="password" show-password size="large">
              <template #prepend><div class="input-prefix">密码</div></template>
              <template #suffix><div style="color: #4abce2" @click="loginModel = 'forgetPassword'">忘记密码?</div></template>
            </el-input>
          </el-form-item>
        </div>
        <div v-else-if="loginModel == 'email'">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" size="large">
              <template #prepend><div class="input-prefix">邮&ensp;&ensp;箱</div></template>
              <template #append>
                <el-button ref="sendVerifyCodeRef" :style="{ color: buttonColor }" @click="sendVerifyCode(loginFormRef)" :disabled="isSendVerifyCode"
                  >发送验证码</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" size="large">
              <template #prepend><div class="input-prefix">验证码</div></template>
            </el-input>
          </el-form-item>
        </div>
        <div v-else-if="loginModel == 'register'">
          <el-form-item prop="username">
            <el-input class="login-first-input" v-model="loginForm.username" placeholder="请输入用户名" size="large">
              <template #prepend><div class="input-prefix">账&ensp;&ensp;号</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="login-last-input" v-model="loginForm.password" placeholder="请输入密码" type="password" show-password size="large">
              <template #prepend><div class="input-prefix">密&ensp;&ensp;码</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input
              class="login-last-input"
              v-model="loginForm.checkPassword"
              placeholder="请再次输入密码"
              type="password"
              show-password
              size="large"
            >
              <template #prepend><div class="input-prefix">确认密码</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" size="large">
              <template #prepend><div class="input-prefix">邮&ensp;&ensp;箱</div></template>
              <template #append>
                <el-button
                  ref="sendVerifyCodeRef"
                  :style="{ color: buttonColor }"
                  @click="sendVerifyCode(loginFormRef)"
                  :disabled="isSendVerifyCode"
                  :loading="isSendingVerifyCode"
                  >发送验证码</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" size="large">
              <template #prepend><div class="input-prefix">验证码</div></template>
            </el-input>
          </el-form-item>
        </div>
        <div v-else-if="loginModel == 'forgetPassword'">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" size="large">
              <template #prepend><div class="input-prefix">邮&ensp;&ensp;箱</div></template>
              <template #append>
                <el-button
                  ref="sendVerifyCodeRef"
                  :style="{ color: buttonColor }"
                  @click="sendVerifyCode(loginFormRef)"
                  :disabled="isSendVerifyCode"
                  d
                  >发送验证码</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" size="large">
              <template #prepend><div class="input-prefix">验证码</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="login-last-input" v-model="loginForm.password" placeholder="请输入密码" type="password" show-password size="large">
              <template #prepend><div class="input-prefix">密&ensp;&ensp;码</div></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input
              class="login-last-input"
              v-model="loginForm.checkPassword"
              placeholder="请再次输入密码"
              type="password"
              show-password
              size="large"
            >
              <template #prepend><div class="input-prefix">确认密码</div></template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex-center" style="justify-content: space-between">
          <el-checkbox v-model="loginForm.remember" label="记住我"></el-checkbox>
          <div v-if="loginModel != 'register'" class="flex-center" style="cursor: pointer" @click="loginModel = 'register'">
            <p class="small-text" style="font-weight: bold">注册</p>
            <el-icon size="14"><Right /></el-icon>
          </div>
          <div v-else class="flex-center" style="cursor: pointer" @click="loginModel = 'username'">
            <p class="small-text" style="font-weight: bold">登录</p>
            <el-icon size="14"><Right /></el-icon>
          </div>
        </div>
        <div class="flex-center" style="justify-content: center">
          <el-button v-if="loginModel == 'email' || loginModel == 'username'" type="success" size="large" @click="login(loginFormRef)"
            >登录</el-button
          >
          <el-button v-else-if="loginModel == 'register'" type="success" size="large" @click="register(loginFormRef)">注册</el-button>
          <el-button v-else-if="loginModel == 'forgetPassword'" type="success" size="large" @click="register(loginFormRef)">确认找回</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 上传选择对话框 -->
    <el-dialog v-model="uploadDialogVisible" width="700">
      <el-row :gutter="15">
        <el-col :span="8">
          <div class="upload-select" @click="uploadSelect('skill')">
            <div class="title-text">道具</div>
            <img src="../../public/agent/sova/sova_3.webp" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="upload-select" @click="uploadSelect('penetrate')">
            <div class="title-text">穿点</div>
            <img src="../../public/image/icon/ak.png" style="width: 30%; margin-top: 37px" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="upload-select" @click="uploadSelect('point')">
            <div class="title-text">地图编辑</div>
            <img src="../../public/image/icon/mapEdit.png" /></div
        ></el-col>
      </el-row>
    </el-dialog>
  </el-container>
</template>
<style lang="scss" scoped>
.el-container {
  height: 100vh;
  background-color: #1a1a1a;

  .el-header {
    display: flex;
    border-bottom: 1px solid #363636;
    height: 65px;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 150px;
    }

    .navigation {
      display: flex;

      align-items: center;

      .el-menu {
        // width: 300px;
        border-bottom: none;
      }

      .el-input {
        width: 200px;
        height: 30px;
        margin-left: 20px;
        --el-input-focus-border-color: #ff4655;
        --el-input-bg-color: #1a1a1a;
        --el-input-border-color: #363636;
      }
    }

    .user {
      display: flex;
      align-items: center;
    }
  }

  .el-main {
    --el-main-padding: 0px;
    // height: 100%;
    // box-sizing: border-box;

    div {
      height: 100%;
    }
  }

  .login-dialog {
    background-color: red;

    .input-prefix {
      font-size: 14px;
      color: #fff;
    }

    .el-button {
      width: 48%;
    }

    .switch-text {
      cursor: pointer;
    }

    .switch-text:first-child {
      color: #4abce2;
    }
  }

  .upload-select {
    width: inherit;
    height: 200px;
    // padding-bottom: 100%;
    background-color: #363636;
    // border: 1px solid red;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
      margin-top: 30px;
    }

    img {
      margin-top: 20px;
      width: 25%;
    }
  }

  .upload-select:hover {
    background-color: #727272;
  }
}
</style>
<style lang="scss">
.login-dialog {
  // background-image: url('../../public/image/background/login.png') !important;
  // background-repeat: no-repeat !important;
  // background-size: cover !important;
  background-color: rgba(20, 20, 20, 0.9) !important;

  .el-dialog__footer {
    padding-top: 0;
  }
}
/* 全局样式，子组件也能用，注意类名的唯一性 */
/* 弹出框动画位置控制  */
.avatar-popover-style {
  background-color: #242628 !important;
  border: none !important;
  /* transform: translate(-14px, 20px); */

  .avatar-popover {
    text-align: center;

    .avatar-name {
      font-size: large;
      margin-top: 25px;
      margin-bottom: -10px;
    }

    .avatar-num {
      color: #fff;
      font-size: 20px;
      margin-bottom: -10px;
    }

    .avatar-button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      // 上右下左
      margin: 5px 30px 15px 30px;

      span {
        margin-left: 15px;
        margin-right: auto;
      }
    }

    .avatar-button:last-child {
      margin-top: 20px;
    }

    .avatar-divider {
      border-color: #363636;
      margin: 5px 20px 0 20px;
    }
  }
}

.popover-style-enter {
  /* transform: translate(-14px, 0px); */
  transform: translate(116px, 0px);
}

.popover-style-leave {
  /* transform: translate(3.5px, -38px); */
  transform: translate(116px, -38px);
}

/* 头像动画 */
// TODO 尝试将绝对定位转化为relaive，否则会影响其他元素的位置
.nav-avatar {
  position: absolute;
  right: 190px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.nav-avatar-anime1 {
  animation: avatar-enlarge 0.4s ease forwards !important;
}

.nav-avatar-anime2 {
  animation: avatar-reduce 0.4s ease forwards !important;
}

@keyframes avatar-enlarge {
  from {
    transform: translateY(0px);
    position: absolute;
    right: 190px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  to {
    transform: translateY(20px);
    position: absolute;
    right: 190px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    z-index: 10000;
  }
}

@keyframes avatar-reduce {
  from {
    transform: translateY(20px);
    position: absolute;
    right: 190px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    z-index: 10000;
  }
  to {
    transform: translateY(0px);
    position: absolute;
    right: 190px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
}
</style>
