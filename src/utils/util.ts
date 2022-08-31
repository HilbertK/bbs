/* eslint-disable guard-for-in */
import { RcFile } from 'antd/lib/upload';
import { IArticleData } from '../service/interface';
import { Page } from './constants';
import { isObject } from './is';

export function getParamsFromUrl(): Record<string, string> {
    let search = location.search;
    const result: Record<string, string> = {};
    if (search !== '') {
        search = search.substring(1);
        const items = search.split('&');
        for (const item of items) {
            const temp = item.split('=');
            if (temp.length !== 0 && temp[0] !== undefined && temp[1] !== undefined) {
                result[temp[0]] = decodeURIComponent(temp[1]);
            }
        }
    }
    const hash = location.hash.substring(1);
    if (hash !== '') {
        const hashArr = hash.split('&');
        for (const item of hashArr) {
            const temp = item.split('=');
            if (temp.length !== 0 && temp[0] !== undefined && temp[1] !== undefined) {
                result[temp[0]] = decodeURIComponent(temp[1]);
            }
        }
    }
    return result;
}

export const getSizeString = (size: number) => {
    const TEXT = ['B', 'KB', 'MB', 'GB', 'TB'];
    let t = 0;
    let siz = size || 0;

    if (isNaN(siz)) {
        return '未知大小';
    }
    // 当附件大小为0或信息错误时不显示附件大小
    if (siz <= 0) {
        return '0B';
    }
    while (siz >= 1024 && t < 3) {
        t++;
        siz /= 1024;
    }
    return String(Math.floor(siz * 100) / 100) + TEXT[t];
};

export function setObjToUrlParams(baseUrl: string, obj: any): string {
    let parameters = '';
    for (const key in obj) {
        parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    parameters = parameters.replace(/&$/, '');
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export const getArticleLink = (id: string) => `/${Page.Article}?id=${id}`;

export const calcArticleHot = (articleData: IArticleData) =>
    articleData.view_num + articleData.comments.length * 2 + articleData.like_num * 2 + articleData.collect_num * 8;

const settingScreenWidth = 1440;
export const calcWidth = (settingWidth: number) => Math.round(settingWidth / settingScreenWidth * window.innerWidth);

export const isDevelopment = __node_env__ === 'development';

export const isTest = __node_env__ === 'testing';

export const isProduction = __node_env__ === 'production';