export interface IArticle {
    id: string,
    author: string,
    data: string,
    title: string,
    description: string,
    category: string[],
}

export interface ArticleListData {
    data: Array<IArticleData>,
    total: number,
}

export type ArticleParams = Omit<IArticle, 'id' | 'author'>;

export interface ArticleListSorter {
    key: string,
    order: 'ascend' | 'descend' | null,
}

export interface ArticleListRange {
    start: number,
    count: number,
}

export type ArticleListFilters = Record<string, any[] | null>;

export interface ArticleListParams {
    search_key: string,
    range: ArticleListRange,
    filters: ArticleListFilters | null,
    sorter: ArticleListSorter | null,
}

export interface IReply {
    id: string,
    user_name: string,
    user_avatar: string,
    content: string,
}

export interface IComment {
    id: string,
    user_name: string,
    user_avatar: string,
    content: string,
    like: boolean,
    reply_list: Array<IReply>,

}

export type IArticleData = IArticle & {
    view_num: number,
    like_num: number,
    like: boolean,
    comments: Array<IComment>,
    collect_num: number,
    collect: boolean,
    create_time: string,
    update_time: string,
    [rest: string]: any,
};

export interface IUserInfo {
    name: string,
    id: string,
    avatar: string,
}