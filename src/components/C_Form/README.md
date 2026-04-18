# C_Form — 移动端配置驱动表单组件

> 通过 `fields` 数组描述字段，自动渲染表单，内置验证、双向绑定、多字段类型支持。

## 基本用法

```vue
<template>
  <C_Form
    v-model:values="formData"
    :fields="fields"
    :loading="submitting"
    submit-text="提交"
    reset-text="重置"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import type { FormField } from '#/Form/type';

const formData = ref({});
const submitting = ref(false);

const fields: FormField[] = [
  { key: 'name', label: '姓名', required: true, prefixIcon: 'i-ph:user-bold' },
  { key: 'phone', label: '手机号', type: 'digit', maxlength: 11, required: true },
  { key: 'gender', label: '性别', type: 'select', options: [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' },
  ]},
  { key: 'remark', label: '备注', type: 'textarea', rows: 3, showWordLimit: true, maxlength: 200 },
  { key: 'notify', label: '接收通知', type: 'switch' },
];

const handleSubmit = (values) => {
  console.log('提交数据：', values);
};
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `values` | `FormValues` | `{}` | 表单数据（v-model:values 双向绑定） |
| `fields` | `FormField[]` | — | **必填**，字段配置数组 |
| `submitText` | `string` | `'提 交'` | 提交按钮文案 |
| `resetText` | `string` | `''` | 重置按钮文案（空则不显示） |
| `loading` | `boolean` | `false` | 提交加载状态 |
| `showActions` | `boolean` | `true` | 是否显示操作按钮区 |
| `labelWidth` | `string` | `'6em'` | label 宽度 |
| `inputAlign` | `'left' \| 'center' \| 'right'` | `'right'` | 输入对齐方式 |
| `showError` | `boolean` | `false` | 是否在单元格下方显示验证信息 |
| `scrollToError` | `boolean` | `true` | 是否滚动到第一个错误字段 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:values` | `(values: FormValues)` | 数据变更 |
| `submit` | `(values: FormValues)` | 表单提交（已通过验证） |
| `reset` | — | 重置表单 |

## Expose

| 方法 | 说明 |
|------|------|
| `validate()` | 手动触发验证，返回 Promise |
| `resetValidation()` | 重置验证状态 |
| `resetFields()` | 重置所有字段值 + 验证状态 |
| `getValues()` | 获取当前表单数据副本 |

## 支持的字段类型

| type | 渲染组件 | 说明 |
|------|---------|------|
| `text` | VanField | 文本输入（默认） |
| `password` | VanField | 密码输入 |
| `number` | VanField | 数字输入（含小数点） |
| `digit` | VanField | 整数输入 |
| `textarea` | VanField(textarea) | 多行文本 |
| `select` | VanField + VanPopup + VanPicker | 下拉选择 |
| `switch` | VanField + VanSwitch | 开关 |
| `checkbox` | VanField + VanCheckboxGroup | 多选 |
| `radio` | VanField + VanRadioGroup | 单选 |

## FormField 配置

```ts
interface FormField {
  key: string;              // 字段名
  label: string;            // 标签
  type?: FormFieldType;     // 字段类型（默认 text）
  placeholder?: string;     // 占位文案
  required?: boolean;       // 是否必填
  rules?: FormFieldRule[];  // 自定义验证规则
  options?: SelectOption[]; // 选项（select/checkbox/radio）
  disabled?: boolean;       // 禁用
  readonly?: boolean;       // 只读
  maxlength?: number;       // 最大长度
  showWordLimit?: boolean;  // 显示字数统计
  rows?: number;            // textarea 行数
  extra?: string;           // 右侧附加文字
  prefixIcon?: string;      // 左侧图标（UnoCSS 类名）
  fieldClass?: string;      // 自定义 CSS 类
  visible?: boolean | ((values) => boolean); // 条件显示
}
```

## 适用场景

- **简单/快速表单**：字段数 ≤ 10，无复杂分区布局
- 复杂表单（多 Tab 分区、嵌套子表）建议直接用 `VanForm + VanCellGroup inset` 手写
