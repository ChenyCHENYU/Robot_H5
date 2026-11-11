import { test, expect, type Page } from '@playwright/test';

type LoginFrame = { login: boolean; target: boolean; opacity: number; path: string };

declare global {
    interface Window {
        loginTrace: { frames: LoginFrame[]; stop: boolean };
    }
}

async function fillCaptcha(page: Page) {
    const image = page.locator('.login-form__captcha-img');
    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    const code = [...decodeURIComponent(src!.split(',').slice(1).join(',')).matchAll(/<text [^>]*>(\d)<\/text>/g)]
        .map(match => match[1]).join('');
    await page.getByPlaceholder('验证码', { exact: true }).fill(code);
}

// 持续采样浏览器绘制帧，不能只凭最终 URL / 首页可见判断没有闪烁。
async function traceLogin(page: Page, targetSelector: string) {
    await page.evaluate(target => {
        const trace = { frames: [] as LoginFrame[], stop: false };
        window.loginTrace = trace;
        let covered = false;
        const sample = () => {
            const overlay = document.querySelector('.login-success');
            const opacity = overlay ? Number(getComputedStyle(overlay).opacity) : 0;
            // 减少动态效果时可能同帧直接切页，没有完全不透明的成功动画。
            if (opacity >= 0.999 || !location.pathname.endsWith('/login')) covered = true;
            if (covered) trace.frames.push({
                login: !!document.querySelector('.login-page'),
                target: !!document.querySelector(target),
                opacity,
                path: location.pathname,
            });
            if (!trace.stop) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
    }, targetSelector);
}

for (const scenario of [
    { name: '默认动画', animate: true, reducedMotion: 'no-preference', redirect: '/', target: '.dashboard' },
    { name: '慢速离场与懒加载', animate: true, reducedMotion: 'no-preference', redirect: '/', target: '.dashboard', slow: true },
    { name: '关闭页面动画', animate: false, reducedMotion: 'no-preference', redirect: '/', target: '.dashboard' },
    { name: '减少动态效果及深层回跳', animate: true, reducedMotion: 'reduce', redirect: '/keepAliveDemo?from=login', target: '.ka-page' },
] as const) {
    test(`登录交接逐帧无登录页回闪或空帧：${scenario.name}`, async ({ page }, testInfo) => {
        const errors: string[] = [];
        let captchas = 0;
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => { if (new URL(request.url()).pathname === '/api/captcha') captchas++; });
        await page.emulateMedia({ reducedMotion: scenario.reducedMotion });
        await page.addInitScript(animate => {
            localStorage.setItem('THEME-SETTING', JSON.stringify({ isPageAnimate: animate, pageAnimateType: 'fade' }));
        }, scenario.animate);
        if ('slow' in scenario) {
            await page.route('**/api/getUserInfo', async route => {
                await new Promise(resolve => setTimeout(resolve, 700));
                await route.continue();
            });
            await page.route('**/src/views/dashboard/index.vue', async route => {
                await new Promise(resolve => setTimeout(resolve, 700));
                await route.continue();
            });
        }
        await page.goto(`login?redirect=${encodeURIComponent(scenario.redirect)}`);
        await expect(page.locator('#app-shell')).toHaveCount(0);
        await fillCaptcha(page);
        if ('slow' in scenario) {
            await page.addStyleTag({ content: '.fade-leave-active, .fade-enter-active { transition-duration: 1s !important; }' });
        }
        await traceLogin(page, scenario.target);
        await page.getByRole('button', { name: '登录', exact: true }).click();
        await expect(page.locator(scenario.target)).toBeVisible();
        await expect(page.locator('.login-success')).toHaveCount(0);
        await expect(page.locator('.login-page')).toHaveCount(0);
        const frames = await page.evaluate(async () => {
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            window.loginTrace.stop = true;
            return window.loginTrace.frames;
        });
        await testInfo.attach('login-frames', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
        expect(frames.length).toBeGreaterThan(0);
        expect(frames.filter(frame => frame.opacity < 0.999 && frame.login), '遮罩淡出后不能再露出登录页').toEqual([]);
        expect(frames.filter(frame => frame.opacity < 0.999 && !frame.target), '遮罩撤去前目标页面必须已挂载').toEqual([]);
        expect(captchas, '登录组件不能因写入会话或导航被重新挂载').toBe(1);
        expect(errors).toEqual([]);
    });
}

test('同会话保留缓存，切公司及退出换号清除旧缓存', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('login?redirect=/keepAliveDemo');
    await fillCaptcha(page);
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.locator('.ka-page__counter-num')).toHaveText('0');
    await page.getByRole('button', { name: '计数 +1' }).click();
    await page.getByRole('button', { name: '跳转子页' }).click();
    await expect(page.locator('.about-page')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.about-page')).toHaveCount(0);
    await expect(page.locator('.ka-page__counter-num')).toHaveText('1');
    await page.evaluate(async () => {
        const { useUserStore } = await import(/* @vite-ignore */ '/robot-h5/src/store/modules/user.ts');
        useUserStore().setCompanyId('login-regression-company');
    });
    await expect(page.locator('.ka-page__counter-num')).toHaveText('0');
    await page.getByRole('button', { name: '计数 +1' }).click();
    await page.evaluate(async () => {
        const { useUserStore } = await import(/* @vite-ignore */ '/robot-h5/src/store/modules/user.ts');
        await useUserStore().Logout();
    });
    await expect(page.locator('.login-page')).toBeVisible();
    await expect(page.locator('.login-success')).toHaveCount(0);
    await page.getByPlaceholder('用户名', { exact: true }).fill('test');
    await fillCaptcha(page);
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.locator('.dashboard__name')).toHaveText('哈哈你个大西瓜');
    await page.getByRole('tablist').getByText('组件', { exact: true }).click();
    await page.getByText('状态缓存', { exact: true }).click();
    await expect(page.locator('.ka-page__counter-num')).toHaveText('0');
    expect(errors).toEqual([]);
});
