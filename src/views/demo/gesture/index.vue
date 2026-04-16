<template>
  <div class="ges-page">
    <C_NavBar />
    <div class="ges-page__body">
      <!-- SwipeCell 滑动删除 -->
      <div class="ges-page__section">
        <div class="ges-page__section-header">
          <div class="ges-page__section-icon" style="background: #ff3b30">
            <i class="i-ph:trash-bold" />
          </div>
          <div>
            <h3 class="ges-page__section-title">滑动删除</h3>
            <p class="ges-page__section-desc">左滑显示操作按钮</p>
          </div>
        </div>
        <div class="ges-page__list">
          <VanSwipeCell v-for="item in swipeList" :key="item.id">
            <div class="ges-page__item" @click="handleToggle(item)">
              <i
                :class="
                  item.done ? 'i-ph:check-circle-fill' : 'i-ph:circle-bold'
                "
                :style="{
                  color: item.done
                    ? 'var(--ds-success)'
                    : 'var(--ds-text-tertiary)',
                  fontSize: '20px',
                }"
              />
              <span
                class="ges-page__item-name"
                :class="{ 'ges-page__item-name--done': item.done }"
              >
                {{ item.name }}
              </span>
            </div>
            <template #right>
              <VanButton
                square
                type="danger"
                text="删除"
                class="ges-page__swipe-btn"
                @click="handleDelete(item.id)"
              />
            </template>
          </VanSwipeCell>
        </div>
      </div>

      <!-- 长按操作 -->
      <div class="ges-page__section">
        <div class="ges-page__section-header">
          <div class="ges-page__section-icon" style="background: #ff9500">
            <i class="i-ph:hand-tap-bold" />
          </div>
          <div>
            <h3 class="ges-page__section-title">长按操作</h3>
            <p class="ges-page__section-desc">长按卡片弹出操作菜单</p>
          </div>
        </div>
        <div class="ges-page__grid">
          <div
            v-for="n in 4"
            :key="n"
            class="ges-page__grid-card"
            v-long-press="() => handleLongPress(`卡片 ${n}`)"
          >
            <div class="ges-page__grid-card-shine" />
            <i
              class="i-ph:folder-bold"
              style="font-size: 28px; color: var(--ds-accent)"
            />
            <span>卡片 {{ n }}</span>
          </div>
        </div>
      </div>

      <!-- 侧滑操作菜单 -->
      <div class="ges-page__section">
        <div class="ges-page__section-header">
          <div class="ges-page__section-icon" style="background: #007aff">
            <i class="i-ph:sidebar-simple-bold" />
          </div>
          <div>
            <h3 class="ges-page__section-title">多按钮侧滑</h3>
            <p class="ges-page__section-desc">左滑显示置顶和归档</p>
          </div>
        </div>
        <div class="ges-page__list">
          <VanSwipeCell v-for="item in menuList" :key="item.id">
            <div class="ges-page__mail-item">
              <div class="ges-page__mail-dot" v-if="item.unread" />
              <div class="ges-page__mail-info">
                <span class="ges-page__mail-title">{{ item.title }}</span>
                <span class="ges-page__mail-desc">{{ item.desc }}</span>
              </div>
              <i
                class="i-ph:caret-right-bold"
                style="color: var(--ds-text-tertiary); font-size: 14px"
              />
            </div>
            <template #right>
              <VanButton
                square
                type="primary"
                text="置顶"
                class="ges-page__swipe-btn"
                @click="handlePin(item.id)"
              />
              <VanButton
                square
                type="warning"
                text="归档"
                class="ges-page__swipe-btn"
                @click="handleArchive(item.id)"
              />
            </template>
          </VanSwipeCell>
        </div>
      </div>
    </div>

    <!-- 长按 ActionSheet -->
    <VanActionSheet
      v-model:show="showLongPressSheet"
      :actions="longPressActions"
      cancel-text="取消"
      close-on-click-action
      :description="`操作：${longPressTarget}`"
      @select="handleLongPressAction"
    />
  </div>
</template>

<script setup lang="ts">
import './index.scss';
import { showToast } from 'vant';

// ---- SwipeCell 滑动删除 ----
const swipeList = ref([
  { id: 1, name: '待办事项 A', done: false },
  { id: 2, name: '待办事项 B', done: true },
  { id: 3, name: '待办事项 C', done: false },
  { id: 4, name: '待办事项 D', done: false },
  { id: 5, name: '待办事项 E', done: true },
]);

const handleDelete = (id: number) => {
  swipeList.value = swipeList.value.filter((item) => item.id !== id);
  showToast({ message: '已删除', position: 'top' });
};

const handleToggle = (item: { id: number; done: boolean }) => {
  item.done = !item.done;
  showToast({
    message: item.done ? '已完成' : '已恢复',
    position: 'top',
  });
};

// ---- 长按操作 ----
const longPressTarget = ref('');
const showLongPressSheet = ref(false);
const longPressActions = [
  { name: '复制' },
  { name: '编辑' },
  { name: '置顶' },
  { name: '删除', color: '#ff3b30' },
];

const handleLongPress = (name: string) => {
  longPressTarget.value = name;
  showLongPressSheet.value = true;
};

const handleLongPressAction = (action: { name: string }) => {
  showToast({
    message: `对「${longPressTarget.value}」执行：${action.name}`,
    position: 'top',
  });
};

// ---- 侧滑操作菜单 ----
const menuList = ref([
  { id: 1, title: '项目文档', desc: '最近编辑于 2 小时前', unread: true },
  { id: 2, title: '会议记录', desc: '最近编辑于 1 天前', unread: false },
  { id: 3, title: '设计稿评审', desc: '最近编辑于 3 天前', unread: true },
]);

const handlePin = (id: number) => {
  showToast({ message: `已置顶 #${id}`, position: 'top' });
};

const handleArchive = (id: number) => {
  menuList.value = menuList.value.filter((item) => item.id !== id);
  showToast({ message: '已归档', position: 'top' });
};
</script>
