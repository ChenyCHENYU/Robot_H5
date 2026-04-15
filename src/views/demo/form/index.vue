<script setup lang="ts">
    import './index.scss';
    import { type FormInstance, showToast } from 'vant';

// ---- Step 控制 ----
const step = ref(0);

// ---- Step 1: 基本信息 ----
const formRef1 = ref<FormInstance>();
const form1 = reactive({
  username: '',
  phone: '',
});

const validateUsername = (value: string) => {
  if (!value) return '请输入用户名';
  if (value.length < 2 || value.length > 16) return '用户名 2-16 个字符';
  return true;
};

// 异步校验 — 模拟检查用户名是否已存在
const asyncCheckUsername = (value: string) =>
  new Promise<boolean | string>((resolve) => {
    setTimeout(() => {
      resolve(value === 'admin' ? '该用户名已被占用' : true);
    }, 800);
  });

const validatePhone = (value: string) => {
  if (!value) return '请输入手机号';
  if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不正确';
  return true;
};

const handleNext1 = async () => {
  try {
    await formRef1.value?.validate();
    step.value = 1;
  } catch {}
};

// ---- Step 2: 密码设置 ----
const formRef2 = ref<FormInstance>();
const form2 = reactive({
  password: '',
  confirmPassword: '',
});
const showPass = ref(false);
const showConfirmPass = ref(false);

const validatePassword = (value: string) => {
  if (!value) return '请设置密码';
  if (value.length < 6) return '密码至少 6 位';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return '需包含字母和数字';
  return true;
};

const validateConfirm = (value: string) => {
  if (!value) return '请再次输入密码';
  if (value !== form2.password) return '两次密码不一致';
  return true;
};

const handleNext2 = async () => {
  try {
    await formRef2.value?.validate();
    step.value = 2;
  } catch {}
};

// ---- Step 3: 补充信息（动态规则） ----
const formRef3 = ref<FormInstance>();
const form3 = reactive({
  nickname: '',
  email: '',
  needInvoice: false,
  company: '',
});

// 动态规则 — 勾选"需要发票"后"公司名称"变为必填
const companyRules = computed(() =>
  form3.needInvoice
    ? [{ required: true, message: '勾选发票后必须填写公司名称' }]
    : [],
);

const handleSubmit = async () => {
  try {
    await formRef3.value?.validate();
    showToast({ message: '注册成功！', type: 'success' });
    // Reset
    setTimeout(() => {
      step.value = 0;
      Object.assign(form1, { username: '', phone: '' });
      Object.assign(form2, { password: '', confirmPassword: '' });
      Object.assign(form3, {
        nickname: '',
        email: '',
        needInvoice: false,
        company: '',
      });
    }, 500);
  } catch {}
};
</script>

<template>
  <div class="form-demo">
    <CNavBar />

    <!-- 步骤指示器 -->
    <div class="form-demo__steps">
      <VanSteps :active="step" active-color="var(--ds-accent)">
        <VanStep>基本信息</VanStep>
        <VanStep>设置密码</VanStep>
        <VanStep>补充信息</VanStep>
      </VanSteps>
    </div>

    <div class="form-demo__body">
      <!-- Step 1: 基本信息 -->
      <div v-show="step === 0" class="form-demo__section">
        <div class="form-demo__card">
          <div class="form-demo__card-shine" />
          <VanForm ref="formRef1">
            <VanField
              v-model="form1.username"
              name="username"
              label="用户名"
              placeholder="2-16 字符（admin 已占用）"
              class="form-demo__field"
              :rules="[
                { validator: validateUsername, trigger: 'onBlur' },
                {
                  validator: asyncCheckUsername,
                  trigger: 'onBlur',
                  message: '检查中...',
                },
              ]"
            />
            <VanField
              v-model="form1.phone"
              name="phone"
              type="tel"
              label="手机号"
              placeholder="11 位手机号"
              maxlength="11"
              class="form-demo__field"
              :rules="[{ validator: validatePhone, trigger: 'onBlur' }]"
            />
          </VanForm>
        </div>
        <p class="form-demo__hint">
          <i class="i-ph:info-bold" />
          试试输入 <code>admin</code> 触发异步校验
        </p>
        <VanButton type="primary" round block @click="handleNext1"
          >下一步</VanButton
        >
      </div>

      <!-- Step 2: 密码设置 -->
      <div v-show="step === 1" class="form-demo__section">
        <div class="form-demo__card">
          <div class="form-demo__card-shine" />
          <VanForm ref="formRef2">
            <VanField
              v-model="form2.password"
              name="password"
              :type="showPass ? 'text' : 'password'"
              label="密码"
              placeholder="至少 6 位，含字母和数字"
              class="form-demo__field"
              :rules="[{ validator: validatePassword, trigger: 'onBlur' }]"
            >
              <template #right-icon>
                <i
                  :class="showPass ? 'i-ph:eye-bold' : 'i-ph:eye-slash-bold'"
                  style="font-size: 18px; color: var(--ds-text-tertiary)"
                  @click="showPass = !showPass"
                />
              </template>
            </VanField>
            <VanField
              v-model="form2.confirmPassword"
              name="confirmPassword"
              :type="showConfirmPass ? 'text' : 'password'"
              label="确认密码"
              placeholder="请再次输入密码"
              class="form-demo__field"
              :rules="[{ validator: validateConfirm, trigger: 'onBlur' }]"
            >
              <template #right-icon>
                <i
                  :class="
                    showConfirmPass ? 'i-ph:eye-bold' : 'i-ph:eye-slash-bold'
                  "
                  style="font-size: 18px; color: var(--ds-text-tertiary)"
                  @click="showConfirmPass = !showConfirmPass"
                />
              </template>
            </VanField>
          </VanForm>
        </div>
        <div class="form-demo__btn-row">
          <VanButton round block @click="step = 0">上一步</VanButton>
          <VanButton type="primary" round block @click="handleNext2"
            >下一步</VanButton
          >
        </div>
      </div>

      <!-- Step 3: 补充信息 -->
      <div v-show="step === 2" class="form-demo__section">
        <div class="form-demo__card">
          <div class="form-demo__card-shine" />
          <VanForm ref="formRef3">
            <VanField
              v-model="form3.nickname"
              name="nickname"
              label="昵称"
              placeholder="选填"
              class="form-demo__field"
            />
            <VanField
              v-model="form3.email"
              name="email"
              type="email"
              label="邮箱"
              placeholder="选填"
              class="form-demo__field"
              :rules="[
                {
                  pattern: /^$|^[\w.-]+@[\w.-]+\.\w+$/,
                  message: '邮箱格式不正确',
                  trigger: 'onBlur',
                },
              ]"
            />
            <VanField
              name="needInvoice"
              label="需要发票"
              class="form-demo__field"
            >
              <template #input>
                <VanSwitch v-model="form3.needInvoice" size="20" />
              </template>
            </VanField>
            <VanField
              v-if="form3.needInvoice"
              v-model="form3.company"
              name="company"
              label="公司名称"
              placeholder="请输入公司全称"
              class="form-demo__field"
              :rules="companyRules"
            />
          </VanForm>
        </div>
        <p class="form-demo__hint">
          <i class="i-ph:lightbulb-bold" />
          勾选「需要发票」后会动态新增必填字段
        </p>
        <div class="form-demo__btn-row">
          <VanButton round block @click="step = 1">上一步</VanButton>
          <VanButton type="primary" round block @click="handleSubmit"
            >提交注册</VanButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
