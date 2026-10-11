export interface FeedItem {
    id: number;
    title: string;
    desc: string;
    time: string;
    category: string;
    categoryType: string;
    isNew?: boolean;
}
