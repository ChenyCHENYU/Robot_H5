import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
    await page.goto('login');
    const image = page.locator('.login-form__captcha-img');
    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    const code = [...decodeURIComponent(src!.split(',').slice(1).join(',')).matchAll(/<text [^>]*>(\d)<\/text>/g)].map(match => match[1]).join('');
    await page.getByPlaceholder('验证码', { exact: true }).fill(code);
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.locator('.dashboard__name')).toHaveText('CHENY');
}

// 通过 Vite 已编译模块验证应用正在使用的公共层，网络仅在本地拦截。
async function call(page: Page, method: 'get' | 'post', path: string) {
    return page.evaluate(async ({ method, path }) => {
        const api = await import(/* @vite-ignore */ '/robot-h5/src/utils/http/index.ts');
        try { return { status: 'resolved', value: await api[method](path, undefined, { isShowMessage: false }) }; }
        catch (error) { return { status: 'rejected', message: String(error) }; }
    }, { method, path });
}

test('默认账号、验证码错误及登录成功', async ({ page }) => {
    await page.goto('login');
    await expect(page.getByPlaceholder('用户名', { exact: true })).toHaveValue('CHENY');
    await expect(page.getByPlaceholder('密码', { exact: true })).toHaveValue('123456');
    await page.getByPlaceholder('验证码', { exact: true }).fill('0000');
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.getByText('验证码错误或已过期，请刷新', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/login$/);
    await login(page);
});

test('业务错误 reject；GET 等待重试成功；POST 不后台重发', async ({ page }) => {
    await login(page);
    await page.route('**/api/regression-error*', route => route.fulfill({ json: { code: 300, data: null, message: '业务失败' } }));
    expect((await call(page, 'get', '/regression-error')).status).toBe('rejected');
    let reads = 0;
    await page.route('**/api/regression-read*', route => route.fulfill(++reads === 1 ? { status: 503 } : { json: { code: 2000, data: { ok: true }, message: 'ok' } }));
    expect(await call(page, 'get', '/regression-read')).toEqual({ status: 'resolved', value: { ok: true } });
    expect(reads).toBe(2);
    let writes = 0;
    await page.route('**/api/regression-write*', route => { writes++; return route.fulfill({ status: 503 }); });
    expect((await call(page, 'post', '/regression-write')).status).toBe('rejected');
    await page.waitForTimeout(1200);
    expect(writes).toBe(1);
});

test('返回缓存页保留计数和输入', async ({ page }) => {
    await login(page);
    await page.goto('keepAliveDemo');
    await page.getByRole('button', { name: '计数 +1' }).click();
    await page.getByPlaceholder('输入后离开页面再返回').fill('缓存验证');
    await page.getByRole('button', { name: '跳转子页' }).click();
    await expect(page.locator('.about-page')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.about-page')).toHaveCount(0);
    await expect(page.locator('.ka-page__counter-num')).toHaveText('1');
    await expect(page.getByPlaceholder('输入后离开页面再返回')).toHaveValue('缓存验证');
});

test('字体和主题色全局生效；离开设置页仍跟随系统；刷新后恢复', async ({ page }) => {
    await login(page);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('themeSetting');
    const before = await page.locator('.theme-page__section-title').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    await page.locator('.theme-page__color-dot').nth(4).click();
    await page.evaluate(async () => {
        const { useThemeStore } = await import(/* @vite-ignore */ '/robot-h5/src/store/modules/theme.ts');
        useThemeStore().setFontScale(1.15);
    });
    const after = await page.locator('.theme-page__section-title').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(after / before).toBeCloseTo(1.15, 1);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim())).toBe('#009688');
    await page.locator('.van-cell').filter({ hasText: '跟随系统' }).getByRole('switch').click();
    await page.getByRole('button', { name: '返回' }).click();
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--ds-font-scale'))).toBe('1.15');
});

test('昵称保存后同步个人中心及刷新后的用户信息', async ({ page }) => {
    await login(page);
    await page.goto('editNickname');
    const name = `验证${Date.now().toString().slice(-6)}`;
    await page.getByPlaceholder('请输入昵称（2-12字）').fill(name);
    await page.getByRole('button', { name: '保存', exact: true }).click();
    await expect(page).toHaveURL(/editInfo$/);
    await page.goto('mine');
    await expect(page.locator('.mine-page__name')).toHaveText(name);
    await page.reload();
    await expect(page.locator('.mine-page__name')).toHaveText(name);
    // 恢复共用演示账号，避免下一项依赖前一项的修改。
    await page.evaluate(async () => {
        const { useUserStore } = await import(/* @vite-ignore */ '/robot-h5/src/store/modules/user.ts');
        await useUserStore().UpdateProfile({ nickname: 'CHENY' });
    });
});

test('客户新增、详情、编辑、转化和作废闭环', async ({ page }) => {
    await login(page);
    await page.goto('customerForm');
    const name = `回归客户${Date.now()}`;
    await page.getByPlaceholder('请输入客户名称').fill(name);
    await page.locator('input[name="customerClass"]').click();
    await page.getByRole('button', { name: '确认', exact: true }).click();
    await page.getByPlaceholder('请输入联系人姓名').fill('测试联系人');
    await page.getByPlaceholder('请输入手机号').fill('13800138000');
    await page.getByRole('button', { name: '提 交' }).click();
    await expect(page.locator('.customer-detail__name')).toHaveText(name);
    await page.reload();
    await expect(page.locator('.customer-detail__name')).toHaveText(name);
    await page.getByRole('button', { name: '编辑', exact: true }).click();
    await page.getByPlaceholder('请输入客户名称').fill(`${name}已编辑`);
    await page.getByRole('button', { name: '保 存' }).click();
    await expect(page.locator('.customer-detail__name')).toHaveText(`${name}已编辑`);
    await page.getByRole('button', { name: '转化', exact: true }).click();
    await expect(page.locator('.customer-detail__header-top')).toContainText('已转化');
    await page.goto('customerArchive');
    await page.getByPlaceholder('点击输入客户名称').fill(name);
    await page.getByRole('button', { name: '作废', exact: true }).click();
    await page.getByRole('button', { name: '确认', exact: true }).click();
    await expect(page.locator('.customer-list__card')).toHaveCount(0);
});

test('真实分页组件：失败重试保持原页；刷新失败重试替换旧列表', async ({ page }) => {
    await login(page);
    const result = await page.evaluate(async () => {
        const { createApp, h, ref, nextTick } = await import(/* @vite-ignore */ '/robot-h5/node_modules/.vite/deps/vue.js');
        const { default: Component } = await import(/* @vite-ignore */ '/robot-h5/src/components/C_PullRefreshList/index.vue');
        const host = document.createElement('div'); document.body.append(host);
        const child = ref(); const requests: number[] = [];
        const app = createApp({ setup: () => () => h(Component, { ref: child, immediateCheck: false, onOnLoad: (page: number) => requests.push(page) }) });
        app.mount(host); await nextTick();
        const state = child.value.$.setupState;
        state.handleLoad(); child.value.updateList([{ id: 1 }], 30);
        state.handleLoad(); child.value.setError(); state.handleErrorClick();
        child.value.updateList([{ id: 2 }], 30);
        child.value.refresh(); child.value.setError(); state.handleErrorClick();
        child.value.updateList([{ id: 99 }], 1);
        const rows = child.value.list.map((row: { id: number }) => row.id);
        app.unmount(); host.remove(); return { requests, rows };
    });
    expect(result).toEqual({ requests: [1, 2, 2, 1, 1], rows: [99] });
});

test('注册、短信验证、登录、密码重置和新密码登录', async ({ page }) => {
    await page.goto('login');
    await page.getByRole('button', { name: '创建账号', exact: true }).click();
    const username = `user${Date.now()}`;
    const mobile = `139${Date.now().toString().slice(-8)}`;
    await page.getByPlaceholder('用户名', { exact: true }).fill(username);
    await page.getByPlaceholder('手机号码', { exact: true }).fill(mobile);
    await page.getByRole('button', { name: '发送验证码', exact: true }).click();
    await expect(page.getByText('演示验证码：123456', { exact: true })).toBeVisible();
    await page.getByPlaceholder('请输入短信验证码', { exact: true }).fill('123456');
    await page.getByPlaceholder('密码', { exact: true }).fill('123456');
    await page.getByPlaceholder('确认密码', { exact: true }).fill('123456');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '注册', exact: true }).click();
    await expect(page.getByRole('button', { name: '登录', exact: true })).toBeVisible();
    await page.getByPlaceholder('用户名', { exact: true }).fill(username);
    await page.getByPlaceholder('密码', { exact: true }).fill('123456');
    const source = await page.locator('.login-form__captcha-img').getAttribute('src');
    const code = [...decodeURIComponent(source!.split(',').slice(1).join(',')).matchAll(/<text [^>]*>(\d)<\/text>/g)].map(match => match[1]).join('');
    await page.getByPlaceholder('验证码', { exact: true }).fill(code);
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.locator('.dashboard__name')).toHaveText(username);
    await page.evaluate(async () => { const { useUserStore } = await import(/* @vite-ignore */ '/robot-h5/src/store/modules/user.ts'); useUserStore().clearLocalSession(); });
    await page.goto('login');
    await page.getByRole('button', { name: '忘记密码？', exact: true }).click();
    await page.getByPlaceholder('用户名', { exact: true }).fill(username);
    await page.getByPlaceholder('手机号码', { exact: true }).fill(mobile);
    await page.getByRole('button', { name: '发送验证码', exact: true }).click();
    await page.getByPlaceholder('请输入短信验证码', { exact: true }).fill('123456');
    await page.getByPlaceholder('新密码（至少6位）', { exact: true }).fill('654321');
    await page.getByPlaceholder('确认新密码', { exact: true }).fill('654321');
    await page.getByRole('button', { name: '重置密码', exact: true }).click();
    await expect(page.getByRole('button', { name: '登录', exact: true })).toBeVisible();
    await page.getByPlaceholder('用户名', { exact: true }).fill(username);
    await page.getByPlaceholder('密码', { exact: true }).fill('654321');
    const source2 = await page.locator('.login-form__captcha-img').getAttribute('src');
    const code2 = [...decodeURIComponent(source2!.split(',').slice(1).join(',')).matchAll(/<text [^>]*>(\d)<\/text>/g)].map(match => match[1]).join('');
    await page.getByPlaceholder('验证码', { exact: true }).fill(code2);
    await page.getByRole('button', { name: '登录', exact: true }).click();
    await expect(page.locator('.dashboard__name')).toHaveText(username);
});

test('C_Table 刷新成功后允许继续加载下一页', async ({ page }) => {
    await login(page);
    const result = await page.evaluate(async () => {
        const { createApp, h, ref, nextTick } = await import(/* @vite-ignore */ '/robot-h5/node_modules/.vite/deps/vue.js');
        const { default: Component } = await import(/* @vite-ignore */ '/robot-h5/src/components/C_Table/index.vue');
        const host = document.createElement('div'); document.body.append(host);
        const child = ref(), loading = ref(false), data = ref([{ id: 1 }]); const requests: (number | string)[] = [];
        const app = createApp({ setup: () => () => h(Component, { ref: child, data: data.value, loading: loading.value, pageSize: 1, total: 3, columns: [], onRefresh: () => { requests.push('refresh'); loading.value = true; }, onLoad: (page: number) => requests.push(page) }) });
        app.mount(host); await nextTick(); child.value.refresh(); await nextTick();
        data.value = [{ id: 11 }]; loading.value = false; await nextTick(); await nextTick();
        child.value.$.setupState.handleLoad();
        const refreshing = child.value.$.setupState.isRefreshing;
        app.unmount(); host.remove(); return { requests, refreshing };
    });
    expect(result).toEqual({ requests: ['refresh', 2], refreshing: false });
});

test('返回列表恢复筛选与实际滚动位置', async ({ page }) => {
    await login(page);
    await page.goto('scrollCache');
    await expect(page.locator('.sc-page__item')).toHaveCount(10);
    await page.locator('.app-page-scroll').evaluate(el => { el.scrollTop = 200; el.dispatchEvent(new Event('scroll')); });
    const before = await page.locator('.app-page-scroll').evaluate(el => el.scrollTop);
    expect(before).toBeGreaterThan(0);
    await page.getByRole('button', { name: '子页面', exact: true }).click();
    await expect(page.locator('.about-page')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.about-page')).toHaveCount(0);
    await expect.poll(() => page.locator('.app-page-scroll').evaluate(el => el.scrollTop)).toBe(before);
});

test('登录失效只提示一次，并按当前 base 跳转登录', async ({ page }) => {
    await login(page);
    await page.route('**/api/regression-expired*', route => route.fulfill({ json: { code: 4001, data: null, message: '过期' } }));
    await Promise.all([call(page, 'get', '/regression-expired'), call(page, 'get', '/regression-expired')]);
    await expect(page.locator('.van-dialog')).toHaveCount(1);
    await page.getByRole('button', { name: '确认', exact: true }).click();
    await expect(page).toHaveURL(/\/robot-h5\/login$/);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('CURRENT-USER')!).token)).toBe('');
});

test('更新检测使用部署 base，重复检查只通知一次', async ({ page }) => {
    await login(page);
    await page.route('**/robot-h5/env.json', route => route.fulfill({ json: { application: { id: 'robot-h5', version: '9.0.0' }, build: { commitSha: 'new-version', builtAt: '2099-01-01' } } }));
    const updates = await page.evaluate(async () => {
        const { Updater } = await import(/* @vite-ignore */ '/robot-h5/src/utils/updater.ts');
        const updater = new Updater({ timer: 3600000 });
        let count = 0;
        updater.on('update', () => { count++; });
        await updater.check(); await updater.check(); updater.stopTiming();
        return count;
    });
    expect(updates).toBe(1);
});
