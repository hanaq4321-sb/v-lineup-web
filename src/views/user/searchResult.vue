<script setup>
import { ref } from 'vue'
// icon
import sort from '~icons/fa6-solid/sort'
import SortDownIcon from '~icons/fa6-solid/sort-down'
import SortUpIcon from '~icons/fa6-solid/sort-up'

const array = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
const heatSelect = ref(0)
const timeSelect = ref(0)
const sortSelect = (d, event) => {
  switch (d) {
    case '默认':
      heatSelect.value = 0
      timeSelect.value = 0
      break
    case '热度':
      timeSelect.value = 0
      heatSelect.value += 1
      heatSelect.value %= 3
      if (heatSelect.value == 0) heatSelect.value += 1
      break
    case '时间':
      heatSelect.value = 0
      timeSelect.value += 1
      timeSelect.value %= 3
      if (timeSelect.value == 0) timeSelect.value += 1
      break
    default:
      break
  }

  const e = event.target
  const parent = e.parentNode
  const liArray = parent.getElementsByTagName('li')
  for (const li of liArray) {
    li.classList.remove('li-focus')
  }
  e.classList.add('li-focus')
}
const difficultySelect = (d, event) => {
  const e = event.target
  const parent = e.parentNode
  // HTMLCollection是包含html对象的数组列表，不能直接使用forEach，需转换或使用for
  const liArray = parent.getElementsByTagName('li')
  for (const li of liArray) {
    li.classList.remove('li-focus')
  }
  e.classList.add('li-focus')
}
</script>

<template>
  <div class="container">
    <div class="classify">
      <div>
        <h3>排序</h3>
        <ul>
          <li class="li-focus" @click="sortSelect('默认', $event)">默认</li>
          <li @click="sortSelect('热度', $event)">
            热度
            <sort class="icon" v-if="heatSelect == 0"></sort>
            <SortDownIcon class="icon" v-if="heatSelect == 1"></SortDownIcon>
            <SortUpIcon class="icon" v-if="heatSelect == 2"></SortUpIcon>
          </li>
          <li @click="sortSelect('时间', $event)">
            时间
            <sort class="icon" v-if="timeSelect == 0"></sort>
            <SortDownIcon class="icon" v-if="timeSelect == 1"></SortDownIcon>
            <SortUpIcon class="icon" v-if="timeSelect == 2"></SortUpIcon>
          </li>
        </ul>
      </div>
      <div>
        <h3>难度</h3>
        <ul>
          <li class="li-focus" @click="difficultySelect('全部', $event)">全部</li>
          <li @click="difficultySelect('简单', $event)">简单</li>
          <li @click="difficultySelect('中等', $event)">中等</li>
          <li @click="difficultySelect('困难', $event)">困难</li>
        </ul>
      </div>
      <div>
        <!-- TODO 配色考虑 -->
        <h3>阵营</h3>
        <ul>
          <li class="li-focus" @click="difficultySelect('全部', $event)">全部</li>
          <li @click="difficultySelect('进攻方', $event)">进攻方</li>
          <li @click="difficultySelect('防守方', $event)">防守方</li>
        </ul>
      </div>
    </div>
    <div class="result">
      <div class="card" v-for="a in array">
        <img src="../../../public/Pasted image 20250806131110.png" />
        <div class="title">A大前压箭</div>
        <div class="content">content round round 123 round round round round round round round round312</div>
        <div class="tags">
          <el-tag type="primary" round>进攻方</el-tag>
          <el-tag type="danger" round>困难</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: start;
  justify-content: space-between;
  min-height: 100%;
  border: 1px solid red;
  box-sizing: border-box;
  // overflow: hidden;
}

.classify {
  min-width: 300px;
  background-color: #242628;
  padding-inline: 15px;
  padding-bottom: 15px;
  margin: 15px;
  box-sizing: border-box;
  border-radius: 15px;

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }

  li {
    margin-right: 5px;
    padding: 3px 5px;
    list-style: none;
  }

  .li-focus {
    background-color: #5686b4;
    border-radius: 15px;
  }

  li:hover {
    background-color: #5686b4;
    border-radius: 15px;
  }

  .icon {
    font-size: 14px;
    vertical-align: -20%;
  }
}

.result {
  display: flex;
  flex-wrap: wrap;
  align-items: start; // 如果不设置align-items，则子元素默认撑满父元素
  width: 77%;
  border: 1px solid white;
  padding: 20px 10px;
  box-sizing: border-box;

  .card {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: #242628;
    // NOTE transition可以为一个元素在不同状态之间切换的时候定义不同的过渡效果，比如:hover，:active 或者通过 JavaScript 实现的状态变化。
    transition: transform 0.15s ease;
    margin: 10px 10px;

    img {
      object-fit: cover;
      border-radius: 10px 10px 0 0;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 5px;
      padding: 0 5px;
    }

    .content {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 5px;
      padding: 0 5px;
    }

    .tags {
      margin-top: 5px;
      margin-bottom: 5px;
      padding: 0 2px;
    }
  }

  @media (max-width: 1440px) {
    .card {
      width: 200px;
    }
  }

  @media (min-width: 1440px) {
    .card {
      width: 23%;
    }
  }

  @media (min-width: 1920px) {
    .card {
      width: 18%;
    }
  }

  .card:hover {
    transform: translate(-2.5px, -2.5px);
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
  }
}

@media (max-width: 1440px) {
  .container {
    min-width: 1000px;
  }
}
</style>
