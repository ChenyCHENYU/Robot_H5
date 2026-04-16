<script setup lang="ts">
    import { showToast, showConfirmDialog } from 'vant';

    defineOptions({ name: 'CFormDemo' });

    const router = useRouter();

    const form = reactive({
        deviceName: '',
        deviceCode: '',
        location: '',
        faultType: '',
        urgency: 'normal',
        faultParts: [] as string[],
        faultDesc: '',
        reporter: '',
        phone: '',
        notifyManager: true,
    });

    const showFaultPicker = ref(false);
    const faultColumns = ['机械故障', '电气故障', '液压故障', '仪表异常', '其他'];
    const faultValueMap: Record<string, string> = {
        机械故障: 'mechanical',
        电气故障: 'electrical',
        液压故障: 'hydraulic',
        仪表异常: 'instrument',
        其他: 'other',
    };
    const faultLabelMap: Record<string, string> = Object.fromEntries(
        Object.entries(faultValueMap).map(([k, v]) => [v, k]),
    );
    const onFaultConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
        form.faultType = faultValueMap[selectedValues[0]] ?? selectedValues[0];
        showFaultPicker.value = false;
    };

    const partOptions = [
        { name: '主体', value: 'body' },
        { name: '传动系统', value: 'drive' },
        { name: '控制系统', value: 'control' },
        { name: '润滑系统', value: 'lube' },
    ];
    const togglePart = (val: string) => {
        const idx = form.faultParts.indexOf(val);
        if (idx >= 0) form.faultParts.splice(idx, 1);
        else form.faultParts.push(val);
    };

    const onlyRequired = ref(false);
    const formRef = ref();
    const loading = ref(false);

    const onSubmit = async () => {
        try {
            await formRef.value?.validate();
        } catch {
            return;
        }
        loading.value = true;
        setTimeout(() => {
            loading.value = false;
            showToast({ message: '提交成功', icon: 'success' });
            router.back();
        }, 800);
    };

    const onCancel = () => {
        showConfirmDialog({ title: '提示', message: '确定放弃当前编辑？' })
            .then(() => router.back())
            .catch(() => {});
    };

    const urgencyConfig = [
        { value: 'normal', label: '一般', color: 'var(--ds-text-secondary)' },
        { value: 'urgent', label: '紧急', color: 'var(--ds-warning)' },
        { value: 'critical', label: '特急', color: 'var(--ds-danger)' },
    ];
</script>

<template>
    <div class="repair-form">
        <div class="repair-form__hero">
            <div class="repair-form__orb repair-form__orb--1" />
            <div class="repair-form__orb repair-form__orb--2" />
            <C_NavBar class="repair-form__navbar" />
            <div class="repair-form__hero-body">
                <div class="repair-form__hero-badge">
                    <i class="i-ph:wrench-bold" />
                    <span>维修工单</span>
                </div>
                <h1 class="repair-form__hero-title">设备报修</h1>
                <p class="repair-form__hero-sub">填写故障信息 · 派单给维修工程师</p>
            </div>
            <label class="repair-form__required-toggle">
                <span>仅显示必填</span>
                <VanSwitch v-model="onlyRequired" size="14px" />
            </label>
        </div>

        <VanForm ref="formRef" :show-error="false" scroll-to-error class="repair-form__body">
            <div class="repair-form__card">
                <div class="repair-form__card-label">
                    <i class="i-ph:gear-six-bold" />
                    <span>设备信息</span>
                </div>
                <VanField
                    v-model="form.deviceName"
                    name="deviceName"
                    label="设备名称"
                    placeholder="请输入设备名称"
                    required
                    :rules="[{ required: true, message: '请输入设备名称' }]"
                    class="repair-form__field"
                />
                <VanField
                    v-model="form.deviceCode"
                    name="deviceCode"
                    label="设备编号"
                    placeholder="如 EQ-2024-001"
                    required
                    :rules="[{ required: true, message: '请输入设备编号' }]"
                    class="repair-form__field"
                    :class="{ 'repair-form__field--last': onlyRequired }"
                />
                <VanField
                    v-if="!onlyRequired"
                    v-model="form.location"
                    name="location"
                    label="所在车间"
                    placeholder="请输入车间位置"
                    class="repair-form__field repair-form__field--last"
                />
            </div>

            <div class="repair-form__card">
                <div class="repair-form__card-label">
                    <i class="i-ph:warning-circle-bold" />
                    <span>故障信息</span>
                </div>
                <VanField
                    :model-value="faultLabelMap[form.faultType] ?? ''"
                    name="faultType"
                    label="故障类型"
                    placeholder="请选择"
                    required
                    readonly
                    is-link
                    :rules="[{ required: true, message: '请选择故障类型' }]"
                    class="repair-form__field"
                    @click="showFaultPicker = true"
                />
                <div class="repair-form__row">
                    <span class="repair-form__row-label">紧急程度</span>
                    <div class="repair-form__pills">
                        <button
                            v-for="u in urgencyConfig"
                            :key="u.value"
                            type="button"
                            class="repair-form__pill"
                            :class="{ 'is-active': form.urgency === u.value }"
                            :style="form.urgency === u.value ? { '--pill-color': u.color } : {}"
                            @click="form.urgency = u.value"
                        >
                            {{ u.label }}
                        </button>
                    </div>
                </div>
                <div v-if="!onlyRequired" class="repair-form__row repair-form__row--parts">
                    <span class="repair-form__row-label">故障部位</span>
                    <div class="repair-form__chips">
                        <button
                            v-for="p in partOptions"
                            :key="p.value"
                            type="button"
                            class="repair-form__chip"
                            :class="{ 'is-active': form.faultParts.includes(p.value) }"
                            @click="togglePart(p.value)"
                        >
                            <i v-if="form.faultParts.includes(p.value)" class="i-ph:check-bold" />
                            {{ p.name }}
                        </button>
                    </div>
                </div>
                <VanField
                    v-model="form.faultDesc"
                    name="faultDesc"
                    label="故障描述"
                    type="textarea"
                    placeholder="请描述故障现象、发生时间等"
                    rows="3"
                    autosize
                    maxlength="300"
                    show-word-limit
                    class="repair-form__field repair-form__field--last"
                />
            </div>

            <div class="repair-form__card">
                <div class="repair-form__card-label">
                    <i class="i-ph:user-circle-bold" />
                    <span>报修人信息</span>
                </div>
                <VanField
                    v-model="form.reporter"
                    name="reporter"
                    label="报修人"
                    placeholder="请输入姓名"
                    required
                    :rules="[{ required: true, message: '请输入报修人' }]"
                    class="repair-form__field"
                />
                <VanField
                    v-model="form.phone"
                    name="phone"
                    label="联系电话"
                    type="tel"
                    placeholder="请输入手机号"
                    required
                    :rules="[
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
                    ]"
                    class="repair-form__field"
                />
                <div class="repair-form__notify">
                    <div class="repair-form__notify-info">
                        <div class="repair-form__notify-icon-wrap">
                            <i class="i-ph:bell-ringing-bold" />
                        </div>
                        <div>
                            <div class="repair-form__notify-title">通知主管</div>
                            <div class="repair-form__notify-desc">提交后自动推送消息给部门主管</div>
                        </div>
                    </div>
                    <VanSwitch v-model="form.notifyManager" size="20px" />
                </div>
            </div>
        </VanForm>

        <div class="repair-form__footer">
            <button type="button" class="repair-form__btn repair-form__btn--cancel" @click="onCancel">取消</button>
            <button
                type="button"
                class="repair-form__btn repair-form__btn--submit"
                :class="{ 'is-loading': loading }"
                @click="onSubmit"
            >
                <i v-if="!loading" class="i-ph:paper-plane-tilt-bold" />
                <i v-else class="i-ph:circle-notch-bold repair-form__spin" />
                <span>{{ loading ? '提交中…' : '提交报修' }}</span>
            </button>
        </div>

        <VanPopup v-model:show="showFaultPicker" position="bottom" round>
            <VanPicker
                :columns="faultColumns"
                @confirm="onFaultConfirm"
                @cancel="showFaultPicker = false"
            />
        </VanPopup>
    </div>
</template>

<style lang="scss" scoped>
.repair-form {
    min-height: 100dvh;
    background: var(--ds-bg);
    display: flex;
    flex-direction: column;
    font-family: var(--ds-font);

    // ─── Hero ───
    &__hero {
        position: relative;
        overflow: hidden;
        padding: 0 20px 20px;
        background: linear-gradient(160deg, var(--ds-bg) 0%, var(--ds-bg-secondary) 100%);
    }

    &__navbar {
        position: relative;
        z-index: 2;
    }

    &__orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(52px);

        &--1 {
            width: 200px;
            height: 200px;
            top: -50px;
            right: -50px;
            background: radial-gradient(circle, #0071e3 0%, rgba(0, 113, 227, 0.1) 70%);
            opacity: 0.4;
        }

        &--2 {
            width: 130px;
            height: 130px;
            bottom: -10px;
            left: -10px;
            background: radial-gradient(circle, #5856d6 0%, rgba(88, 86, 214, 0.1) 70%);
            opacity: 0.28;
        }
    }

    &__hero-body {
        position: relative;
        z-index: 1;
        padding-top: 8px;
    }

    &__hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px 4px 8px;
        border-radius: 100px;
        background: var(--ds-glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--ds-glass-border);
        box-shadow: var(--ds-glass-shine);
        font-size: 11px;
        font-weight: 700;
        color: var(--ds-accent);
        letter-spacing: 0.4px;
        margin-bottom: 10px;

        i { font-size: 12px; }
    }

    &__hero-title {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.8px;
        margin: 0 0 6px;
        background: linear-gradient(135deg, var(--ds-text-primary) 20%, var(--ds-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    &__hero-sub {
        font-size: 13px;
        color: var(--ds-text-secondary);
        margin: 0;
        letter-spacing: 0.1px;
    }

    &__required-toggle {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 500;
        color: var(--ds-text-tertiary);
        cursor: pointer;
    }

    // ─── 表单主体 ───
    &__body {
        flex: 1;
        padding: 12px 16px 88px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    // ─── 玻璃分区卡片 ───
    &__card {
        background: var(--ds-glass-bg);
        backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate));
        -webkit-backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate));
        border-radius: var(--ds-radius-lg);
        border: 1px solid var(--ds-glass-border);
        box-shadow: var(--ds-glass-shine), var(--ds-glass-shadow);
        overflow: hidden;
    }

    &__card-label {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 12px 16px 0;
        font-size: 10px;
        font-weight: 700;
        color: var(--ds-text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.9px;

        i {
            font-size: 13px;
            color: var(--ds-accent);
        }
    }

    // ─── 字段 ───
    &__field {
        background: transparent !important;
        padding: 10px 16px !important;
        border-bottom: 0.5px solid var(--ds-divider);

        &--last {
            border-bottom: none !important;
        }

        :deep(.van-field__label) {
            font-size: 13px;
            color: var(--ds-text-secondary);
            font-weight: 500;
            width: 5em;
        }

        :deep(.van-field__control) {
            font-size: 13px;
            color: var(--ds-text-primary);
        }

        :deep(.van-field__error-message) {
            font-size: 11px;
            padding-top: 2px;
        }

        :deep(.van-field__right-icon) {
            color: var(--ds-text-tertiary);
        }
    }

    // ─── 自定义行容器 ───
    &__row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-bottom: 0.5px solid var(--ds-divider);

        &--parts { align-items: flex-start; }
    }

    &__row-label {
        flex-shrink: 0;
        width: 5em;
        font-size: 13px;
        font-weight: 500;
        color: var(--ds-text-secondary);
    }

    // ─── 紧急程度 pill ───
    &__pills {
        display: flex;
        gap: 6px;
    }

    &__pill {
        --pill-color: var(--ds-text-tertiary);
        height: 26px;
        padding: 0 12px;
        border-radius: 100px;
        border: 1px solid var(--ds-border);
        background: transparent;
        font-size: 12px;
        font-weight: 500;
        color: var(--ds-text-secondary);
        cursor: pointer;
        transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        -webkit-tap-highlight-color: transparent;
        letter-spacing: 0.2px;

        &.is-active {
            background: var(--pill-color);
            border-color: transparent;
            color: #fff;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transform: scale(1.04);
        }
    }

    // ─── 故障部位 chip ───
    &__chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    &__chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        height: 26px;
        padding: 0 10px;
        border-radius: var(--ds-radius-sm);
        border: 1px solid var(--ds-border);
        background: transparent;
        font-size: 12px;
        font-weight: 500;
        color: var(--ds-text-secondary);
        cursor: pointer;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;

        i { font-size: 10px; }

        &.is-active {
            background: var(--ds-accent-light);
            border-color: rgba(0, 113, 227, 0.3);
            color: var(--ds-accent);
            font-weight: 600;
        }
    }

    // ─── 通知主管行 ───
    &__notify {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px 12px;
    }

    &__notify-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    &__notify-icon-wrap {
        width: 36px;
        height: 36px;
        border-radius: var(--ds-radius-sm);
        background: var(--ds-accent-light);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        i {
            font-size: 18px;
            color: var(--ds-accent);
        }
    }

    &__notify-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--ds-text-primary);
        margin-bottom: 2px;
        line-height: 1;
    }

    &__notify-desc {
        font-size: 11px;
        color: var(--ds-text-tertiary);
        line-height: 1.3;
    }

    // ─── 底部操作栏 ───
    &__footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        padding-bottom: calc(10px + env(safe-area-inset-bottom));
        background: var(--ds-glass-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-top: 0.5px solid var(--ds-glass-border);
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        height: 36px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.2px;
        transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        -webkit-tap-highlight-color: transparent;

        i { font-size: 14px; }

        &:active { transform: scale(0.94); }

        &--cancel {
            flex: 0 0 68px;
            background: transparent;
            border: 1px solid var(--ds-border);
            color: var(--ds-text-secondary);
        }

        &--submit {
            flex: 1;
            border: none;
            color: #fff;
            background: linear-gradient(135deg, var(--ds-accent) 0%, #0055c8 100%);
            box-shadow:
                0 4px 16px rgba(0, 113, 227, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.22);

            &.is-loading { opacity: 0.72; }
        }
    }

    &__spin {
        animation: rfSpin 0.8s linear infinite;
    }

    @keyframes rfSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
}

html.dark .repair-form {
    &__pill:not(.is-active),
    &__chip:not(.is-active) {
        background: var(--ds-bg-secondary);
        border-color: var(--ds-border);
    }
}
</style>
