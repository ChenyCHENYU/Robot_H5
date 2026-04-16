<script setup lang="ts">
    /**
     * C_Form — 移动端配置驱动表单组件
     *
     * 设计目标：
     *  1. 配置驱动：通过 fields 数组描述字段，不写模板，只改数据
     *  2. 内置验证：每个字段支持 required / rules / validator 三种验证方式
     *  3. 双向绑定：v-model:values 获取/设置表单数据
     *  4. 多类型支持：text / password / number / textarea / select / switch / checkbox / radio
     *  5. 暴露 validate / resetValidation / resetFields 给父组件
     *
     * 用法示例：
     *  <C_Form
     *    v-model:values="formData"
     *    :fields="fieldsDef"
     *    :loading="submitting"
     *    submit-text="保存"
     *    @submit="handleSubmit"
     *  />
     */
    import './index.scss';
    import { type FormInstance, showToast } from 'vant';

    defineOptions({ name: 'C_Form' });

    // ── 类型定义 ────────────────────────────────────────────

    export type FormFieldType =
        | 'text'
        | 'password'
        | 'number'
        | 'digit'
        | 'textarea'
        | 'select' // 弹出 Picker 选择
        | 'switch'
        | 'checkbox'
        | 'radio';

    export interface SelectOption {
        text: string;
        value: string | number;
    }

    export type FieldValidator = (value: any, rule: FormFieldRule) => boolean | string | Promise<boolean | string>;

    export interface FormFieldRule {
        required?: boolean;
        message?: string;
        pattern?: RegExp;
        min?: number;
        max?: number;
        validator?: FieldValidator;
        trigger?: 'onChange' | 'onBlur';
    }

    export interface FormField {
        /** 字段 key，对应 values 对象中的属性名 */
        key: string;
        /** 表单标签 */
        label: string;
        /** 字段类型，默认 text */
        type?: FormFieldType;
        /** 占位符 */
        placeholder?: string;
        /** 是否必填（会自动添加 required rule） */
        required?: boolean;
        /** 验证规则 */
        rules?: FormFieldRule[];
        /** 选项列表（type=select / radio / checkbox 时使用） */
        options?: SelectOption[];
        /** 是否禁用 */
        disabled?: boolean;
        /** 是否只读 */
        readonly?: boolean;
        /** 最大输入长度（text/textarea） */
        maxlength?: number;
        /** 是否显示字数统计（textarea） */
        showWordLimit?: boolean;
        /** 输入框行数（textarea） */
        rows?: number;
        /** 右侧额外文案 */
        extra?: string;
        /** 左侧图标（UnoCSS 类名，如 "i-ph:user-bold"） */
        prefixIcon?: string;
        /** 字段级自定义 class */
        fieldClass?: string;
        /** 是否显示该字段（支持动态隐藏） */
        visible?: boolean | ((values: Record<string, any>) => boolean);
    }

    export type FormValues = Record<string, any>;

    // 暴露给父组件的实例类型
    export interface CFormInstance {
        validate: () => Promise<void>;
        resetValidation: () => void;
        resetFields: () => void;
        getValues: () => FormValues;
    }

    // ── Props / Emits ────────────────────────────────────────

    const props = withDefaults(
        defineProps<{
            /** 表单数据（v-model:values） */
            values?: FormValues;
            /** 字段配置数组 */
            fields: FormField[];
            /** 提交按钮文案 */
            submitText?: string;
            /** 重置按钮文案（空字符串则不显示） */
            resetText?: string;
            /** 提交加载状态 */
            loading?: boolean;
            /** 是否显示操作按钮区域 */
            showActions?: boolean;
            /** label 宽度 */
            labelWidth?: string;
            /** 输入对齐方式 */
            inputAlign?: 'left' | 'center' | 'right';
            /** 是否在单元格下方显示验证信息 */
            showError?: boolean;
            /** 是否滚动到第一个错误字段 */
            scrollToError?: boolean;
        }>(),
        {
            values: () => ({}),
            submitText: '提 交',
            resetText: '',
            loading: false,
            showActions: true,
            labelWidth: '6em',
            inputAlign: 'right',
            showError: false,
            scrollToError: true,
        },
    );

    const emit = defineEmits<{
        'update:values': [values: FormValues];
        submit: [values: FormValues];
        reset: [];
    }>();

    // ── 内部状态 ─────────────────────────────────────────────

    const formRef = ref<FormInstance>();
    // Picker 显示状态 key → boolean
    const pickerVisible = reactive<Record<string, boolean>>({});

    /** 内部可写副本（不直接修改 prop） */
    const innerValues = reactive<FormValues>({ ...props.values });

    watch(
        () => props.values,
        (val) => Object.assign(innerValues, val),
        { deep: true },
    );

    // 向上同步
    watch(innerValues, (val) => emit('update:values', { ...val }), { deep: true });

    // ── 计算属性 ─────────────────────────────────────────────

    /** 过滤掉隐藏字段 */
    const visibleFields = computed(() =>
        props.fields.filter((f) => {
            const v = f.visible;
            if (v === undefined || v === true) return true;
            if (v === false) return false;
            return v(innerValues);
        }),
    );

    /** 构造字段的 van-field rules */
    const buildRules = (field: FormField) => {
        const rules: any[] = [];
        if (field.required) {
            rules.push({
                required: true,
                message: field.placeholder ? `请${field.type === 'select' ? '选择' : '输入'}${field.label}` : `${field.label}不能为空`,
                trigger: 'onBlur',
            });
        }
        if (field.rules) {
            rules.push(
                ...field.rules.map((r) => ({
                    ...r,
                    trigger: r.trigger ?? 'onBlur',
                })),
            );
        }
        return rules;
    };

    /** 获取 select 字段当前显示文本 */
    const getSelectDisplayText = (field: FormField): string => {
        const val = innerValues[field.key];
        if (val === undefined || val === null || val === '') return '';
        const opt = field.options?.find((o) => o.value === val);
        return opt?.text ?? String(val);
    };

    // ── Picker 处理 ────────────────────────────────────────

    const openPicker = (field: FormField) => {
        if (field.disabled || field.readonly) return;
        pickerVisible[field.key] = true;
    };

    const onPickerConfirm = (field: FormField, { selectedOptions }: { selectedOptions: SelectOption[] }) => {
        const selected = selectedOptions[0];
        if (selected) {
            innerValues[field.key] = selected.value;
        }
        pickerVisible[field.key] = false;
    };

    const onPickerCancel = (key: string) => {
        pickerVisible[key] = false;
    };

    // ── 暴露方法 ─────────────────────────────────────────────

    const validate = async () => {
        try {
            await formRef.value?.validate();
        } catch (err: any) {
            if (props.scrollToError) {
                formRef.value?.scrollToField(err?.[0]?.name ?? '');
            }
            throw err;
        }
    };

    const resetValidation = () => formRef.value?.resetValidation();

    const resetFields = () => {
        props.fields.forEach((f) => {
            if (f.type === 'switch') {
                innerValues[f.key] = false;
            } else if (f.type === 'checkbox') {
                innerValues[f.key] = [];
            } else {
                innerValues[f.key] = '';
            }
        });
        resetValidation();
        emit('reset');
    };

    const getValues = () => ({ ...innerValues });

    defineExpose<CFormInstance>({ validate, resetValidation, resetFields, getValues });

    // ── 提交 ─────────────────────────────────────────────────

    const handleSubmit = async () => {
        try {
            await validate();
            emit('submit', { ...innerValues });
        } catch {
            showToast({ message: '请检查表单填写', position: 'top' });
        }
    };
</script>

<template>
    <VanForm
        ref="formRef"
        class="c-form"
        :show-error="showError"
        :scroll-to-error="scrollToError"
        @submit="handleSubmit"
    >
        <template v-for="field in visibleFields" :key="field.key">
            <!-- ── Switch 类型 ── -->
            <VanField
                v-if="field.type === 'switch'"
                :name="field.key"
                :label="field.label"
                :label-width="labelWidth"
                :class="['c-form__field', field.fieldClass]"
                :rules="buildRules(field)"
                :disabled="field.disabled"
                :center="true"
            >
                <template v-if="field.prefixIcon" #left-icon>
                    <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                </template>
                <template #input>
                    <VanSwitch v-model="innerValues[field.key]" size="22px" />
                </template>
            </VanField>

            <!-- ── Checkbox 类型 ── -->
            <VanField
                v-else-if="field.type === 'checkbox'"
                :name="field.key"
                :label="field.label"
                :label-width="labelWidth"
                :class="['c-form__field', field.fieldClass]"
                :rules="buildRules(field)"
                :disabled="field.disabled"
            >
                <template v-if="field.prefixIcon" #left-icon>
                    <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                </template>
                <template #input>
                    <VanCheckboxGroup v-model="innerValues[field.key]" direction="horizontal">
                        <VanCheckbox
                            v-for="opt in field.options"
                            :key="opt.value"
                            :name="opt.value"
                            shape="square"
                            class="c-form__checkbox"
                        >
                            {{ opt.text }}
                        </VanCheckbox>
                    </VanCheckboxGroup>
                </template>
            </VanField>

            <!-- ── Radio 类型 ── -->
            <VanField
                v-else-if="field.type === 'radio'"
                :name="field.key"
                :label="field.label"
                :label-width="labelWidth"
                :class="['c-form__field', field.fieldClass]"
                :rules="buildRules(field)"
                :disabled="field.disabled"
            >
                <template v-if="field.prefixIcon" #left-icon>
                    <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                </template>
                <template #input>
                    <VanRadioGroup v-model="innerValues[field.key]" direction="horizontal">
                        <VanRadio
                            v-for="opt in field.options"
                            :key="opt.value"
                            :name="opt.value"
                            class="c-form__radio"
                        >
                            {{ opt.text }}
                        </VanRadio>
                    </VanRadioGroup>
                </template>
            </VanField>

            <!-- ── Select 类型（弹出 Picker）── -->
            <template v-else-if="field.type === 'select'">
                <VanField
                    :name="field.key"
                    :label="field.label"
                    :label-width="labelWidth"
                    :class="['c-form__field', field.fieldClass]"
                    :model-value="getSelectDisplayText(field)"
                    :placeholder="field.placeholder || `请选择${field.label}`"
                    :rules="buildRules(field)"
                    :disabled="field.disabled"
                    :readonly="true"
                    :input-align="inputAlign"
                    :center="true"
                    is-link
                    @click="openPicker(field)"
                >
                    <template v-if="field.prefixIcon" #left-icon>
                        <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                    </template>
                </VanField>

                <VanPopup
                    v-model:show="pickerVisible[field.key]"
                    position="bottom"
                    round
                    :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
                >
                    <VanPicker
                        :title="field.label"
                        :columns="(field.options as any[])"
                        @confirm="(val) => onPickerConfirm(field, val as any)"
                        @cancel="onPickerCancel(field.key)"
                    />
                </VanPopup>
            </template>

            <!-- ── Textarea 类型 ── -->
            <VanField
                v-else-if="field.type === 'textarea'"
                v-model="innerValues[field.key]"
                :name="field.key"
                :label="field.label"
                :label-width="labelWidth"
                :class="['c-form__field', 'c-form__field--textarea', field.fieldClass]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :rules="buildRules(field)"
                :disabled="field.disabled"
                :readonly="field.readonly"
                :maxlength="field.maxlength"
                :show-word-limit="field.showWordLimit"
                :rows="field.rows || 3"
                type="textarea"
                autosize
            >
                <template v-if="field.prefixIcon" #left-icon>
                    <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                </template>
            </VanField>

            <!-- ── 普通输入（text / password / number / digit）── -->
            <VanField
                v-else
                v-model="innerValues[field.key]"
                :name="field.key"
                :label="field.label"
                :label-width="labelWidth"
                :class="['c-form__field', field.fieldClass]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :rules="buildRules(field)"
                :type="(field.type as any) || 'text'"
                :disabled="field.disabled"
                :readonly="field.readonly"
                :maxlength="field.maxlength"
                :show-word-limit="field.showWordLimit"
                :input-align="inputAlign"
                :center="true"
                clearable
            >
                <template v-if="field.prefixIcon" #left-icon>
                    <i :class="[field.prefixIcon, 'c-form__prefix-icon']" />
                </template>
                <template v-if="field.extra" #extra>
                    <span class="c-form__extra">{{ field.extra }}</span>
                </template>
            </VanField>
        </template>

        <!-- ── 操作按钮 ── -->
        <div v-if="showActions" class="c-form__actions">
            <VanButton
                v-if="resetText"
                class="c-form__btn c-form__btn--reset"
                block
                plain
                @click="resetFields"
            >
                {{ resetText }}
            </VanButton>
            <VanButton
                class="c-form__btn c-form__btn--submit"
                type="primary"
                block
                native-type="submit"
                :loading="loading"
                :loading-text="submitText"
            >
                {{ submitText }}
            </VanButton>
        </div>
    </VanForm>
</template>
