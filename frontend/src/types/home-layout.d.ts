export interface HomeLayout {
    id: number;
    title: string;
    order: number;
    created_at: Date;
    updated_at: Date;
}

export interface HomeLayoutContent {
    id: number;
    home_layout_id: number;
    type: 'course' | 'mentoring' | 'extra';
    product_id: string;
    order: number;
    image_url: string;
    is_lock?: boolean;
    price?: number;
    price_promotional?: number;
    title?: string;
    created_at: Date;
    updated_at: Date;
}

export interface HomeLayoutWithContents {
    id: number;
    title: string;
    order: number;
    created_at: Date;
    updated_at: Date;
    contents: HomeLayoutContent[]
}