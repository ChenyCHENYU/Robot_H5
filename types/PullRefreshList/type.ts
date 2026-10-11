export type ListItem = object;
export interface PullRefreshListInstance<T extends ListItem> {
    updateList: (data: T[], totalCount?: number) => void;
    setError: () => void;
    reset: () => void;
    refresh: () => void;
    readonly list: T[];
}
export interface PullRefreshListProps {
    disabled?: boolean; offset?: number; immediateCheck?: boolean; pageSize?: number;
    showFinishedTextNumber?: number; pullDownPullingText?: string; pullDownLoosingText?: string;
    pullDownLoadingText?: string; pullDownSuccessText?: string; pullUpLoadingText?: string;
    pullUpFinishedText?: string; pullUpErrorText?: string; emptyDataText?: string;
}
