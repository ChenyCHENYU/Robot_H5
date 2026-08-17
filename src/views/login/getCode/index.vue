<template>
    <div class="get-code-page">
        <C_NavBar title="获取验证码" />

        <div class="get-code-page__content">
            <div class="get-code-page__title">请输入验证码</div>
            <div class="get-code-page__message">{{ message }}</div>
            <div class="get-code-page__input-content">
                <VanField v-model="msgCode" class="get-code-page__field" @input="onInput" />
                <div
                    class="get-code-page__send"
                    :class="{ 'get-code-page__send--active': number === '获取验证码' }"
                    @click="getCode"
                >
                    {{ number }}
                </div>
            </div>
            <VanButton
                size="large"
                type="danger"
                :disabled="disabled"
                class="get-code-page__submit"
                @click="sendCode"
            >
                完成
            </VanButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { useRoute, useRouter } from 'vue-router';
    import { showToast } from 'vant';
    import { compareCodeByPhone, getMsgCode, getUserNoByPhone } from '@/api/auth';
    import { useUserStore } from '@/store/modules/user';
    import { setStore } from '@/utils/store';

    defineOptions({ name: 'GetCode' });

    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();

    const number = ref<number | string>(120);
    const message = ref('');
    const msgCode = ref('');
    const disabled = ref(true);
    const userNo = ref('');
    let backdata = '';
    let timer: ReturnType<typeof setInterval> | null = null;

    const onInput = () => {
        disabled.value = false;
    };

    // 返回时清理倒计时（C_NavBar 已处理返回逻辑）
    onUnmounted(() => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    });

    onBeforeMount(() => {
        userNo.value = (route.query.user as string) || '';
        getCode();
    });

    /** 发送短信验证码（倒计时 120s） */
    const getCode = () => {
        getMsgCode(userNo.value).then((res: any) => {
            if (res.code === 2000) {
                message.value = res.message || '';
                disabled.value = true;
                msgCode.value = '';
                backdata = res.data || '';
                number.value = 120;
                if (timer) clearInterval(timer);
                timer = setInterval(() => {
                    if (number.value !== 0) {
                        number.value = (number.value as number) - 1;
                    } else {
                        number.value = '获取验证码';
                        if (timer) {
                            clearInterval(timer);
                            timer = null;
                        }
                    }
                }, 1000);
            }
        });
    };

    /** 提交验证码 → 校验 → 登录 → 跳转修改密码 */
    const sendCode = async () => {
        try {
            const res: any = await compareCodeByPhone(userNo.value, msgCode.value);
            if (res.code !== 2000) return;
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            let username = userNo.value;
            if (backdata) {
                // 有手机号返回：查询真实用户名
                const r: any = await getUserNoByPhone(backdata);
                username = r.data?.userNo || '';
                if (!username) {
                    showToast('根据用户名找不到账号,请联系管理员');
                    return;
                }
            }
            await userStore.Login({ username, password: '123456', companyId: '1' });
            setStore('userNo', username);
            setStore('pwd', '123456');
            router.replace({ path: '/updatePassword' });
        } catch (e) {
            console.error('验证码校验失败', e);
        }
    };
</script>
