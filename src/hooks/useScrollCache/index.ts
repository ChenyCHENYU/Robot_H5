import { onActivated, onDeactivated, onMounted, onUnmounted, ref, unref, type Ref } from 'vue';

/** 必须在 setup 调用，默认寻找页面最近的实际滚动容器。 */
export function useScrollCache(target?: HTMLElement | Ref<HTMLElement | null> | null, animeStatus = false) {
    const page = ref<HTMLElement | null>(null);
    const position = ref({ top: 0, left: 0 });
    let container: HTMLElement | null = null;
    let active = false;
    let frame = 0;
    const save = () => {
        if (active && container) position.value = { top: container.scrollTop, left: container.scrollLeft };
    };
    const attach = () => {
        const element = unref(target) || page.value;
        const next = element?.closest<HTMLElement>('[data-page-scroll]') || document.querySelector<HTMLElement>('.layout__content') || document.querySelector<HTMLElement>('.app-page-scroll');
        if (container !== next) {
            container?.removeEventListener('scroll', save);
            container = next;
            container?.addEventListener('scroll', save, { passive: true });
        }
        active = true;
        frame = requestAnimationFrame(() => container?.scrollTo({ ...position.value, behavior: animeStatus ? 'smooth' : 'auto' }));
    };
    onMounted(attach);
    onActivated(attach);
    onDeactivated(() => { save(); active = false; cancelAnimationFrame(frame); });
    onUnmounted(() => { cancelAnimationFrame(frame); container?.removeEventListener('scroll', save); });
    return { page, position };
}
