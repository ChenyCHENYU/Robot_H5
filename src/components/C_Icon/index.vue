<template>
    <Icon
        v-if="type === 'iconify'"
        :icon="name"
        :width="normalizedSize"
        :height="normalizedSize"
        :color="color"
        :rotate="rotate"
        :horizontalFlip="flip === 'horizontal' || flip === 'both'"
        :verticalFlip="flip === 'vertical' || flip === 'both'"
        :class="['c-icon', { 'c-icon--clickable': clickable }, customClass]"
        :style="iconStyle"
        @click="handleClick"
    />
    <i
        v-else-if="type === 'unocss'"
        :class="[name, 'c-icon', { 'c-icon--clickable': clickable }, customClass]"
        :style="[iconStyle, unocssStyle]"
        @click="handleClick"
    />
    <C_SvgIcon
        v-else-if="type === 'svg'"
        :name="name"
        :size="normalizedSize"
        :color="color"
        :class="['c-icon', { 'c-icon--clickable': clickable }, customClass]"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';

    defineOptions({ name: 'CIcon' });

    export type IconType = 'iconify' | 'unocss' | 'svg';
    export type FlipType = 'horizontal' | 'vertical' | 'both';

    const props = withDefaults(
        defineProps<{
            /** 图标名称：Iconify 格式 "ph:house-bold" / UnoCSS 格式 "i-ph:house-bold" / SVG 名称 */
            name: string;
            /** 图标类型 */
            type?: IconType;
            /** 图标颜色，支持 CSS 颜色值 */
            color?: string;
            /** 图标尺寸（px） */
            size?: number | string;
            /** 是否可点击（显示 pointer + hover 效果） */
            clickable?: boolean;
            /** 旋转角度（0=0°, 1=90°, 2=180°, 3=270°） */
            rotate?: 0 | 1 | 2 | 3;
            /** 翻转方向 */
            flip?: FlipType;
            /** 自定义 CSS 类 */
            customClass?: string;
        }>(),
        {
            type: 'iconify',
            color: 'currentColor',
            size: 18,
            clickable: false,
            rotate: 0,
            customClass: '',
        },
    );

    const emit = defineEmits<{
        click: [e: MouseEvent];
    }>();

    const normalizedSize = computed(() => {
        const s = props.size;
        return typeof s === 'string' ? parseInt(s, 10) || 18 : s;
    });

    const iconStyle = computed(() => ({
        '--icon-color': props.color,
        fontSize: `${normalizedSize.value}px`,
    }));

    const unocssStyle = computed(() => ({
        width: `${normalizedSize.value}px`,
        height: `${normalizedSize.value}px`,
        color: props.color,
    }));

    function handleClick(e: MouseEvent) {
        if (props.clickable) {
            emit('click', e);
        }
    }
</script>

<style lang="scss">
    .c-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--icon-color, currentColor);
        vertical-align: middle;
        flex-shrink: 0;

        &--clickable {
            cursor: pointer;
            transition: opacity 0.2s ease;

            &:active {
                opacity: 0.6;
            }
        }
    }
</style>
