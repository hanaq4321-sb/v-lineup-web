<script setup>
import { ref } from 'vue'
import { Search, Upload, User, Message, Operation, SwitchButton, ArrowRight } from '@element-plus/icons-vue'
import LineUp from './components/LineUp.vue'
// 道具搜索
const search = ref('')
// 头像动画控制
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
</script>
<template>
  <el-container>
    <el-header>
      <!-- Logo -->
      <img class="logo" src="../assets/logo.png" />
      <!-- 导航栏 -->
      <div class="navigation">
        <!-- string类型不需要冒号，其他类型需要 -->
        <el-menu default-active="2" mode="horizontal" :ellipsis="false" background-color="#1a1a1a" text-color="#fff" active-text-color="#fd4453">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">LineUp</el-menu-item>
          <el-menu-item index="3">社区</el-menu-item>
          <el-menu-item index="4">收藏</el-menu-item>
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
        <el-button type="success">登入</el-button>
        <el-button type="danger" :icon="Upload">投稿</el-button>
      </div>
    </el-header>
    <el-main>
      <LineUp />
    </el-main>
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
        width: 300px;
        border-bottom: none;
      }

      .el-input {
        width: 300pxpx;
        height: 30px;
        margin-left: 20px;
        /* border: 1px solid #363636;
        border-radius: 5px; */
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
}
</style>
<style lang="scss">
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
