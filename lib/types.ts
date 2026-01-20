export interface Link {
    id: string;
    url: string;
    note?: string;
    read: number; // 0 or 1
    timestamp: number;
}
