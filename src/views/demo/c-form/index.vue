<script setup lang="ts">
    import { showToast, showConfirmDialog } from 'vant';

    defineOptions({ name: 'CFormDemo' });

    const router = useRouter();

    // ── 表单数据 ──
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

    // ── 故障类型 Picker ──
    const showFaultPicker = ref(false);
    const faultTypeLabel = computed(() => {
        const map: Record<string, string> = {
            mechanical: '机械故障',
            electrical: '电气故障',
            hydraulic: '液压故障',
            instrument: '仪表异常',
            other: '其他',
        };
        return map[form.faultType] ?? '';
    });
    const faultColumns = ['机械故障', '电气故障', '液压故障', '仪表异常', '其他'];
    const faultValueMap: Record<string, string> = {
        机械故障: 'mechanical',
        电气故障: 'electrical',
        液压故障: 'hydraulic',
        仪表异常: 'instrument',
        其他: 'other',
    };
    const onFaultConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
        form.faultType = faultValueMap[selectedValues[0]] ?? selectedValues[0];
        showFaultPicker.value = false;
    };

    // ── 故障部位 ──
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

    // ── 仅必填 ──
    const onlyRequired = ref(false);

    // ── 提交 ──
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
            showToast('提交成功');
            router.back();
        }, 800);
    };

    const onCancel = () => {
        showConfirmDialog({ title: '提示', message: '确定放弃当前编辑？' })
            .then(() => router.back())
            .catch(() => {});
    };
</script>

<template>
    <div class="repair-form">
        <C_NavBar title="设备报修" />

        <VanForm ref="formRef" :show-error="false" scroll-to-error>
            <!-- ─── 设备信息 ─── -->
            <div class="repair-form__section">
                <div class="repair-form__section-head">
                    <div class="repair-form__section-title">设备信息</div>
                    <label class="repair-form__toggle">
                        <span>仅显示必填</span>
                        <VanSwitch v-model="onlyRequired" size="16px" />
                    </label>
                </div>
                <VanCellGroup inset class="repair-form__cells">
                    <VanField
                        v-model="form.deviceName"
                        name="deviceName"
                        label="设备名称"
                        placeholder="请输入设备名称"
                        required
                        :rules="[{ required: true, message: '请输入设备名称' }]"
                    />
                    <VanField
                        v-model="form.deviceCode"
                        name="deviceCode"
                        label="设备编号"
                        placeholder="如 EQ-2024-001"
                        required
                        :rules="[{ required: true, message: '请输入设备编号' }]"
                    />
                    <VanField
                        v-if="!onlyRequired"
                        v-model="form.location"
                        name="location"
                        label="所在车间"
                        placeholder="请输入车间位置"
                    />
                </VanCellGroup>
            </div>

            <!-- ─── 故障信息 ─── -->
            <div class="repair-form__section">
                <div class="repair-form__section-head">
                    <div class="repair-form__section-title">故障信息</div>
                </div>
                <VanCellGroup inset class="repair-form__cells">
                    <VanField
                        v-model="faultTypeLabel"
                        name="faultType"
                        label="故障类型"
                        placeholder="请选择"
                        required
                        readonly
                        is-link
                        :rules="[{ required: true, message: '请选择故障类型' }]"
                        @click="showFaultPicker = true"
                    />
                    <VanField name="urgency" label="紧急程度" required>
                        <template #input>
                            <VanRadioGroup v-model="form.urgency" direction="horizontal">
                                <VanRadio name="normal">一般</VanRadio>
                                <VanRadio name="urgent">紧急</VanRadio>
                                <VanRadio name="critical">特急</VanRadio>
                            </VanRadioGroup>
                        </template>
                    </VanField>
                    <VanField v-if="!onlyRequired" name="faultParts" label="故障部位">
                        <template #input>
                            <div class="repair-form__parts">
                                <VanTag
                                    v-for="p in partOptions"
                                    :key="p.value"
                                    :type="form.faultParts.includes(p.value) ? 'primary' : 'default'"
                                    round
                                    size="medium"
                                    class="repair-form__part-tag"
                                    @click="togglePart(p.value)"
                                >
                                    {{ p.name }}
                                </VanTag>
                            </div>
                        </template>
                    </VanField>
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
                    />
                </VanCellGroup>
            </div>

            <!-- ─── 报修人信息 ─── -->
            <div class="repair-form__section">
                <div class="repair-form__section-head">
                    <div class="repair-form__section-title">报修人信息</div>
                </div>
                <VanCellGroup inset class="repair-form__cells">
                    <VanField
                        v-model="form.reporter"
                        name="reporter"
                        label="报修人"
                        placeholder="请输入姓名"
                        required
                        :rules="[{ required: true, message: '请输入报修人' }]"
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
                    />
                    <VanCell center title="通知主管">
                        <template #right-icon>
                            <VanSwitch v-model="form.notifyManager" size="20px" />
                        </template>
                    </VanCell>
                </VanCellGroup>
            </div>
        </VanForm>

        <!-- 底部按钮 -->
        <div class="repair-form__footer">
            <VanButton block round @click="onCancel">取 消</VanButton>
            <VanButton block round type="primary" :loading="loading" @click="onSubmit">
                提交报修
            </VanButton>
        </div>

        <!-- Picker -->
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
    padding-bottom: 72px;

    // ── 分区 ──
    &__section {
        margin-bottom: 4px;

        &-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px 4px;
        }

        &-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--ds-text-primary);
            display: flex;
            align-items: center;
            gap: 6px;

            &::before {
                content: '';
                width: 3px;
                height: 14px;
                border-radius: 2px;
                background: var(--ds-accent);
            }
        }
    }

    &__toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--ds-text-tertiary);
    }

    &__cells {
        :deep(.van-field) {
            font-size: 13px;
            padding: 10px 14px;
        }

        :deep(.van-field__label) {
            width: 5em;
            color: var(--ds-text-secondary);
        }

        :deep(.van-field__control) {
            color: var(--ds-text-primary);
        }

        :deep(.van-field__error-message) {
            font-size: 11px;
        }

        :deep(.van-cell) {
            font-size: 13px;
            padding: 10px 14px;
        }

        :deep(.van-cell__title) {
            color: var(--ds-text-secondary);
        }

        :deep(.van-radio__label) {
            font-size: 13px;
        }
    }

    &__parts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__part-tag {
        cursor: pointer;
    }

    // ── 底部按钮 ──
    &__footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        gap: 12px;
        padding: 8px 16px;
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
        background: var(--ds-bg);
        border-top: 0.5px solid var(--ds-divider);

        .van-button {
            height: 40px;
            font-size: 14px;
        }
    }
}
</style>
