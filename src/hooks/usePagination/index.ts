import { ref } from 'vue';

/** 仅确认成功的页码可推进；失败后下一次 start() 请求同一页。 */
export function usePagination(initialPage = 0) {
    const page = ref(initialPage);
    const pending = ref(0);
    const refreshing = ref(false);
    const loading = ref(false);
    const error = ref(false);
    let failedRefresh = false;
    function start(refresh = false): number | undefined {
        if (loading.value) return;
        refresh = refresh || failedRefresh;
        refreshing.value = refresh;
        pending.value = refresh ? 1 : (pending.value || page.value + 1);
        loading.value = true;
        error.value = false;
        return pending.value;
    }
    function succeed() {
        failedRefresh = false;
        page.value = pending.value || page.value;
        loading.value = false;
        refreshing.value = false;
        pending.value = 0;
    }
    function fail() {
        failedRefresh = refreshing.value;
        loading.value = false;
        refreshing.value = false;
        error.value = true;
    }
    function reset() {
        failedRefresh = false;
        page.value = 0;
        pending.value = 0;
        refreshing.value = false;
        loading.value = false;
        error.value = false;
    }
    return { page, pending, refreshing, loading, error, start, succeed, fail, reset };
}
