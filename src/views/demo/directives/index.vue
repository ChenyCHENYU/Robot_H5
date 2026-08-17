<template>
    <div class="dir-page">
        <C_NavBar />
        <div class="dir-page__body">

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#0071e3"><i class="i-ph:copy-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-copy</h3>
                        <p class="dir-page__section-desc">一键复制文本内容</p>
                    </div>
                </div>
                <div class="dir-page__card">
                    <div class="dir-page__card-shine" />
                    <VanField v-model="copyText" class="dir-page__field" placeholder="输入文本，点击复制">
                        <template #button>
                            <VanButton size="small" type="primary" v-copy="copyText">复制</VanButton>
                        </template>
                    </VanField>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#ff9500"><i class="i-ph:arrows-out-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-drag</h3>
                        <p class="dir-page__section-desc">自由拖动元素</p>
                    </div>
                </div>
                <div class="dir-page__card dir-page__card--demo">
                    <div class="dir-page__card-shine" />
                    <p class="dir-page__hint">在下方区域拖动红色方块</p>
                    <div class="dir-page__drag-zone">
                        <div class="dir-page__draggable" v-drag>拖我</div>
                    </div>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#5856d6"><i class="i-ph:hand-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-long-press</h3>
                        <p class="dir-page__section-desc">持续按压触发回调</p>
                    </div>
                </div>
                <div class="dir-page__card" v-long-press="() => showToast('长按成功')">
                    <div class="dir-page__card-shine" />
                    <div class="dir-page__action-tip">
                        <i class="i-ph:hand-pointing-bold" />
                        <span>长按 2 秒触发</span>
                    </div>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#34c759"><i class="i-ph:stamp-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-watermark</h3>
                        <p class="dir-page__section-desc">给容器添加文字水印</p>
                    </div>
                </div>
                <div class="dir-page__card dir-page__card--demo" v-watermark="{ text: '水印演示', textColor: 'rgba(0,113,227,0.25)' }">
                    <div class="dir-page__card-shine" />
                    <div class="dir-page__action-tip"><i class="i-ph:eye-bold" /><span>水印效果</span></div>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#ff2d55"><i class="i-ph:drop-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-ripple</h3>
                        <p class="dir-page__section-desc">点击产生涟漪波纹效果</p>
                    </div>
                </div>
                <div class="dir-page__card" v-ripple>
                    <div class="dir-page__card-shine" />
                    <div class="dir-page__action-tip"><i class="i-ph:cursor-click-bold" /><span>点击我看涟漪</span></div>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#ff9500"><i class="i-ph:timer-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-debounce / v-throttle</h3>
                        <p class="dir-page__section-desc">防抖与节流</p>
                    </div>
                </div>
                <div class="dir-page__card">
                    <div class="dir-page__card-shine" />
                    <div class="dir-page__btn-row">
                        <VanButton
                            size="small" type="primary" plain
                            v-debounce="() => showToast('防抖执行')">防抖提交</VanButton>
                        <VanButton
                            size="small" type="warning" plain
                            v-throttle="() => showToast('节流执行')">节流提交</VanButton>
                    </div>
                    <p class="dir-page__hint">快速点击，体验两者差异</p>
                </div>
            </div>

            <div class="dir-page__section">
                <div class="dir-page__section-header">
                    <div class="dir-page__section-icon" style="background:#af52de"><i class="i-ph:images-square-bold" /></div>
                    <div>
                        <h3 class="dir-page__section-title">v-lazy + v-slide-in</h3>
                        <p class="dir-page__section-desc">图片懒加载 + 滑入动画</p>
                    </div>
                </div>
                <div class="dir-page__img-grid">
                    <img
                        v-for="index in 6" :key="index"
                        class="dir-page__lazy-img"
                        v-slide-in v-lazy="imgUrl + '&key=' + index"
                        alt="lazy"
                    />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    import { showToast } from 'vant';

    const copyText = ref('');
    const imgUrl = ref('https://cdn.seovx.com/ha/?mom=302');
</script>
