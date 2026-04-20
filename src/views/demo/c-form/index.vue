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
                    :model-value="FAULT_LABEL_MAP[form.faultType] ?? ''"
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
                            v-for="u in URGENCY_OPTIONS"
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
                            v-for="p in PART_OPTIONS"
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
                :columns="FAULT_OPTIONS"
                @confirm="onFaultConfirm"
                @cancel="showFaultPicker = false"
            />
        </VanPopup>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast, showConfirmDialog } from 'vant';
    import { FAULT_OPTIONS, FAULT_LABEL_MAP, URGENCY_OPTIONS, PART_OPTIONS } from './data';

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

    // ── 故障类型 ──
    const showFaultPicker = ref(false);
    const onFaultConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
        form.faultType = selectedValues[0] ?? '';
        showFaultPicker.value = false;
    };

    // ── 故障部位 ──
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
</script>
