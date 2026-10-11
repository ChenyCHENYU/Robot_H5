import { onScopeDispose, ref, computed } from 'vue';
import { showToast } from 'vant';
import { sendUserSms } from '@/api/user';

export function useSms(mobile: () => string, purpose: 'register' | 'reset') {
    const remaining = ref(0);
    const sending = ref(false);
    let timer: ReturnType<typeof setInterval> | undefined;
    const label = computed(() => remaining.value ? `${remaining.value}s 后重发` : '发送验证码');
    async function send() {
        if (remaining.value || sending.value) return;
        if (!/^1\d{10}$/.test(mobile())) { showToast('请填写正确的手机号码'); return; }
        sending.value = true;
        try {
            const result = await sendUserSms(mobile(), purpose);
            showToast(result.demoCode ? `演示验证码：${result.demoCode}` : '验证码已发送');
            remaining.value = 60;
            timer = setInterval(() => { if (--remaining.value <= 0) clearInterval(timer); }, 1000);
        } catch { /* HTTP 层统一反馈失败 */ }
        finally { sending.value = false; }
    }
    onScopeDispose(() => clearInterval(timer));
    return { remaining, sending, label, send };
}
