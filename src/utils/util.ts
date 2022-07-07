import { IArticleData } from '../service/interface';
import { Page } from './constants';

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

export const getArticleLink = (id: string) => `/${Page.Article}?id=${id}`;

export const calcArticleHot = (articleData: IArticleData) =>
    articleData.view_num + articleData.comments.length * 2 + articleData.like_num * 2 + articleData.collect_num * 8;

const settingScreenWidth = 1440;
export const calcWidth = (settingWidth: number) => Math.round(settingWidth / settingScreenWidth * window.innerWidth);