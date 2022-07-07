export interface CategoryItem {
    value?: string | number,
    label: React.ReactNode,
    children?: CategoryItem[],
}

export interface CatalogItem {
    level: number,
    title: string,
}