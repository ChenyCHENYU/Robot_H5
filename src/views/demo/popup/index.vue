<template>
  <div class="popup-page">
    <C_NavBar />
    <div class="popup-page__body">
      <!-- ActionSheet -->
      <div class="popup-page__section">
        <div class="popup-page__section-header">
          <div class="popup-page__section-icon" style="background: #5856d6">
            <i class="i-ph:list-bullets-bold" />
          </div>
          <div>
            <h3 class="popup-page__section-title">ActionSheet 动作面板</h3>
            <p class="popup-page__section-desc">底部弹出操作选项</p>
          </div>
        </div>
        <div class="popup-page__card">
          <div class="popup-page__card-shine" />
          <div class="popup-page__btn-row">
            <VanButton
              size="small"
              type="primary"
              round
              @click="showActionSheet = true"
            >
              基础用法
            </VanButton>
            <VanButton size="small" round @click="showActionSheet2 = true">
              分享面板
            </VanButton>
          </div>
        </div>
      </div>

      <!-- Popup 弹出位置 -->
      <div class="popup-page__section">
        <div class="popup-page__section-header">
          <div class="popup-page__section-icon" style="background: #ff9500">
            <i class="i-ph:arrows-out-cardinal-bold" />
          </div>
          <div>
            <h3 class="popup-page__section-title">Popup 弹出层</h3>
            <p class="popup-page__section-desc">支持上下左右居中五个方向</p>
          </div>
        </div>
        <div class="popup-page__card">
          <div class="popup-page__card-shine" />
          <div class="popup-page__btn-grid">
            <VanButton size="small" round @click="openPopup('top')"
              >顶部</VanButton
            >
            <VanButton size="small" round @click="openPopup('bottom')"
              >底部</VanButton
            >
            <VanButton size="small" round @click="openPopup('left')"
              >左侧</VanButton
            >
            <VanButton size="small" round @click="openPopup('right')"
              >右侧</VanButton
            >
            <VanButton
              size="small"
              type="primary"
              round
              @click="openPopup('center')"
              >居中</VanButton
            >
          </div>
        </div>
      </div>

      <!-- Dialog 对话框 -->
      <div class="popup-page__section">
        <div class="popup-page__section-header">
          <div class="popup-page__section-icon" style="background: #34c759">
            <i class="i-ph:chat-circle-text-bold" />
          </div>
          <div>
            <h3 class="popup-page__section-title">Dialog 对话框</h3>
            <p class="popup-page__section-desc">模态确认与提示</p>
          </div>
        </div>
        <div class="popup-page__card">
          <div class="popup-page__card-shine" />
          <div class="popup-page__btn-row">
            <VanButton size="small" round @click="handleAlert"
              >消息提示</VanButton
            >
            <VanButton size="small" type="danger" round @click="handleConfirm"
              >确认删除</VanButton
            >
            <VanButton
              size="small"
              type="primary"
              round
              @click="handleRoundDialog"
              >圆角按钮</VanButton
            >
          </div>
        </div>
      </div>
    </div>

    <!-- ActionSheet 实例 -->
    <VanActionSheet
      v-model:show="showActionSheet"
      :actions="actionSheetActions"
      cancel-text="取消"
      close-on-click-action
      @select="handleActionSelect"
    />
    <VanActionSheet
      v-model:show="showActionSheet2"
      :actions="actionSheetActions2"
      cancel-text="取消"
      close-on-click-action
      description="立即分享给好友"
      @select="handleActionSelect"
    />

    <!-- Popup 实例 -->
    <VanPopup
      v-model:show="showPopup"
      :position="popupPos"
      :round="popupPos === 'bottom'"
      :style="{
        width: popupPos === 'left' || popupPos === 'right' ? '65%' : undefined,
        height: popupPos === 'top' || popupPos === 'bottom' ? '30%' : undefined,
        padding: popupPos === 'center' ? '36px 40px' : '24px',
      }"
    >
      <div class="popup-page__popup-content">
        <i
          class="i-ph:check-circle-bold"
          style="font-size: 32px; color: var(--ds-accent)"
        />
        <span>{{ popupPos }} 弹出层</span>
      </div>
    </VanPopup>
  </div>
</template>

<script setup lang="ts">
import './index.scss';
import { showToast, showDialog, showConfirmDialog } from 'vant';

// ---- ActionSheet ----
const showActionSheet = ref(false);
const actionSheetActions = [
  {
    name: '拍照',
    icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/icon-demo.png',
  },
  { name: '从相册选择' },
  { name: '保存图片' },
];
const handleActionSelect = (action: { name: string }) => {
  showToast({ message: `选择了：${action.name}`, position: 'top' });
};

// ---- 带取消和描述的 ActionSheet ----
const showActionSheet2 = ref(false);
const actionSheetActions2 = [
  { name: '微信', subname: '推荐好友' },
  { name: '朋友圈' },
  { name: 'QQ' },
  { name: '微博', disabled: true },
];

// ---- Popup 各方向 ----
const popupPos = ref<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');
const showPopup = ref(false);
const openPopup = (pos: typeof popupPos.value) => {
  popupPos.value = pos;
  showPopup.value = true;
};

// ---- Dialog ----
const handleAlert = () => {
  showDialog({ title: '提示', message: '这是一段提示信息' });
};

const handleConfirm = () => {
  showConfirmDialog({
    title: '确认操作',
    message: '确定要删除这条数据吗？此操作不可撤销。',
    confirmButtonText: '删除',
    confirmButtonColor: 'var(--ds-danger)',
  })
    .then(() => showToast({ message: '已删除', position: 'top' }))
    .catch(() => showToast({ message: '已取消', position: 'top' }));
};

const handleRoundDialog = () => {
  showConfirmDialog({
    title: '系统升级',
    message: '发现新版本 v2.0.0，是否立即更新？',
    theme: 'round-button',
    confirmButtonText: '立即更新',
    cancelButtonText: '稍后',
  }).catch(() => {});
};
</script>
