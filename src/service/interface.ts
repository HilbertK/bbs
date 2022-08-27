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

export interface LoginParams {
    username: string,
    password: string,
    captcha: string,
    checkKey: number,
}

export interface RegisterParams {
    username: string,
    password: string,
    usertype: string,
    realname: string,
    phone?: string,
}

export interface UploadAuthParams {
    fileName?: string,
}

export interface UploadParams {
    file: any,
    url: string,
}

export interface CheckerParams {
    username?: string,
    phone?: string,
}

export interface ThirdLoginParams {
    token: string,
    thirdType: string,
}

export interface RoleInfo {
    roleName: string,
    value: string,
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
    userId: string | number,
    token: string,
    role: RoleInfo,
}

/**
 * @description: Get user information return value
 */
export interface IUserInfo {
    roles: RoleInfo[],
    // 用户id
    id: string | number,
    // 用户名
    username: string,
    // 真实名字
    realname: string,
    // 头像
    avatar: string,
    sex?: number,
    // 介绍
    description?: string,
    email?: string,
    phone?: string,
    birthday?: string,
    // 用户信息
    userInfo?: any,
}
