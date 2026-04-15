<script setup lang="ts">
import './index.scss';
import { showToast } from 'vant';

defineOptions({ name: 'KeepAliveDemo' });

// 表单状态 — keep-alive 下离开再返回应保留
const formData = reactive({
  name: '',
  remark: '',
});

// 计数器 — 验证组件未被销毁
const counter = ref(0);

// 生命周期追踪
const logs = ref<string[]>([]);
const addLog = (msg: string) => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  logs.value.unshift(`[${time}] ${msg}`);
  if (logs.value.length > 20) logs.value.pop();
};

onMounted(() => addLog('onMounted — 组件首次挂载'));
onActivated(() => addLog('onActivated — 被激活（从缓存恢复）'));
onDeactivated(() => addLog('onDeactivated — 被停用（进入缓存）'));

const handleIncrement = () => {
  counter.value++;
  showToast({ message: `计数 +1 → ${counter.value}`, position: 'top' });
};
</script>

<template>
  <div class="ka-page">
    <CNavBar />

    <div class="ka-page__tip">
      <i class="i-ph:info-bold" />
      修改表单 / 增加计数后，跳转子页面再返回，状态是否保留
    </div>

    <div class="ka-page__body">
      <!-- 表单区域 -->
      <div class="ka-page__section">
        <h3 class="ka-page__section-title">表单状态</h3>
        <div class="ka-page__card">
          <div class="ka-page__card-shine" />
          <VanField
            v-model="formData.name"
            label="姓名"
            placeholder="输入后离开页面再返回"
            class="ka-page__field"
          />
          <VanField
            v-model="formData.remark"
            label="备注"
            type="textarea"
            rows="2"
            placeholder="多行文本也会被缓存"
            class="ka-page__field"
          />
        </div>
      </div>

      <!-- 计数器 -->
      <div class="ka-page__section">
        <h3 class="ka-page__section-title">实例状态</h3>
        <div class="ka-page__card ka-page__card--row">
          <div class="ka-page__card-shine" />
          <div class="ka-page__counter">
            <span class="ka-page__counter-num">{{ counter }}</span>
            <span class="ka-page__counter-label">当前计数</span>
          </div>
          <div class="ka-page__actions">
            <VanButton
              size="small"
              type="primary"
              round
              @click="handleIncrement"
            >
              <i class="i-ph:plus-bold" style="margin-right: 4px" /> 计数 +1
            </VanButton>
            <VanButton size="small" round to="/about">
              <i class="i-ph:arrow-right-bold" style="margin-right: 4px" />
              跳转子页
            </VanButton>
          </div>
        </div>
      </div>

      <!-- 生命周期日志 -->
      <div class="ka-page__section">
        <h3 class="ka-page__section-title">生命周期日志</h3>
        <div class="ka-page__card ka-page__card--logs">
          <div class="ka-page__card-shine" />
          <div v-if="logs.length === 0" class="ka-page__log-empty">
            暂无日志
          </div>
          <div v-for="(log, i) in logs" :key="i" class="ka-page__log-item">
            <i class="i-ph:dot-bold" />
            <span>{{ log }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
