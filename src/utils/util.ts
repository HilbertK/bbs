/* eslint-disable guard-for-in */
import { RcFile } from 'antd/lib/upload';
import { baseDomain } from '../service/api';
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

/**
 *  获取文件服务访问路径
 * @param fileUrl 文件路径
 * @param prefix(默认http)  文件路径前缀 http/https
 */
export const getFileAccessHttpUrl = (fileUrl: string, prefix = 'http') => {
    let result = fileUrl;
    try {
        if (fileUrl && fileUrl.length > 0 && !fileUrl.startsWith(prefix)) {
            //判断是否是数组格式
            let isArray = fileUrl.indexOf('[') !== -1;
            if (!isArray) {
                let prefix = `${baseDomain}/jeecg-system/sys/common/static/`;
                // 判断是否已包含前缀
                if (!fileUrl.startsWith(prefix)) {
                    result = `${prefix}${fileUrl}`;
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
    return result;
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