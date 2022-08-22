import moment from 'moment';
import {v4 as uuid} from 'uuid';
import { calcArticleHot } from '../utils/util';
import { dateFormat } from './constants';
import { IArticleData, ArticleParams, ArticleListData, ArticleListParams, IUserInfo } from './interface';

type SignupUser = Omit<IUserInfo, 'roles' | 'realname'> & {password: string};

class MockService {
    private storeArticleKey = 'store-article';
    private storeSignupUsersKey = 'store-signup-users';
    private storeCurrUserKey = 'store-curr-user';
    private ShortRandomLength = 6;
    private LongRandomLength = 10;
    private devAuthor = 'dev';
    private setStorageArticle(article: ArticleParams) {
        const articleList = this.getStorageArticles();
        const newId = this.generateArticleId();
        const now = Date.now().toString();
        const newArticle: IArticleData = {
            id: newId,
            author: this.getStorageCurrUser()?.realname ?? this.devAuthor,
            view_num: 0,
            like_num: 0,
            collect_num: 0,
            collect: false,
            like: false,
            comments: [],
            create_time: now,
            update_time: now,
            ...article,
        };
        localStorage.setItem(this.storeArticleKey, JSON.stringify([...articleList, newArticle]));
        return newId;
    }

    private editStorageArticle(id: string, params: {[key: keyof IArticleData]: any}) {
        let articleList = this.getStorageArticles();
        const articleIndex = articleList.findIndex(item => item.id === id);
        articleList[articleIndex] = {
            ...articleList[articleIndex],
            ...params,
        };
        localStorage.setItem(this.storeArticleKey, JSON.stringify(articleList));
        return articleList[articleIndex];
    }

    private getStorageArticles() {
        let articleList: IArticleData[] = [];
        try {
            const articlesData = localStorage.getItem(this.storeArticleKey);
            articleList = JSON.parse(articlesData ?? '[]');
        } catch(e) {
            console.error(e);
        }
        return articleList;
    }

    private generateArticleId(): string {
        return `${uuid().slice(-this.ShortRandomLength)}`;
    }

    public publishArticle(article: ArticleParams): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = this.setStorageArticle(article);
                resolve(newId);
            }, 200);
        });
    }

    public fetchArticleList(params: ArticleListParams): Promise<ArticleListData> {
        return new Promise((resolve) => {
            const allData = this.getStorageArticles();
            let result: Array<IArticleData> = allData;
            const { filters, sorter, range } = params;
            const { start, count } = range;
            if (filters != null) {
                result = result.filter(item => Object.entries(filters).every(([key, valueList]) => {
                    if (valueList == null) return true;
                    const itemData = item[key];
                    if (key === 'category') {
                        const cate = itemData.slice(-1)[0];
                        if (cate == null) return false;
                        return valueList.includes(cate);
                    }
                    if (key === 'create_time') {
                        return valueList.includes(moment(parseInt(itemData, 10)).format(dateFormat));
                    }
                    return valueList.includes(itemData);
                }));
            }
            if (sorter != null && sorter.order != null) {
                result = result.sort((a, b) => {
                    const order = sorter.order === 'ascend' ? 1 : -1;
                    if (sorter.key === 'hot') {
                        return (calcArticleHot(a) - calcArticleHot(b)) * order;
                    }
                    return (a[sorter.key] - b[sorter.key]) * order;
                });
            }
            const searchKey = params.search_key;
            if (searchKey !== '') {
                result = result.filter(item => item.title.includes(searchKey) || item.author.includes(searchKey));
            }
            setTimeout(() => {
                resolve({
                    data: result.slice(start, start + count),
                    total: result.length
                });
            }, 200);
        });
    }

    public fetchArticle(id: string): Promise<IArticleData | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.getStorageArticles().find(item => item.id === id) ?? null);
            }, 200);
        });
    }

    public toggleArticleLike(id: string): Promise<IArticleData> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const article = this.getStorageArticles().find(item => item.id === id);
                if (!article) return reject();
                const newArticle = this.editStorageArticle(id, {
                    like: !article.like,
                    like_num: article.like ? article.like_num - 1 : article.like_num + 1
                });
                resolve(newArticle);
            }, 200);
        });
    }

    public toggleArticleCollect(id: string): Promise<IArticleData> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const article = this.getStorageArticles().find(item => item.id === id);
                if (!article) return reject();
                const newArticle = this.editStorageArticle(id, {
                    collect: !article.collect,
                    collect_num: article.collect ? article.collect_num - 1 : article.collect_num + 1
                });
                resolve(newArticle);
            }, 200);
        });
    }

    private generateUserId(): string {
        return `user-${uuid().slice(-this.LongRandomLength)}`;
    }

    private setStorageUser(userInfo: Omit<SignupUser, 'id'>) {
        const newUserId = this.generateUserId();
        const allUsers = this.getStorageSignupUsers();
        const newUser: SignupUser = {
            ...userInfo,
            id: newUserId,
        };
        localStorage.setItem(this.storeSignupUsersKey, JSON.stringify([...allUsers, newUser]));
        return newUserId;
    }

    private getStorageSignupUsers() {
        let users: SignupUser[] = [];
        try {
            const userData = localStorage.getItem(this.storeSignupUsersKey);
            users = JSON.parse(userData ?? '[]');
        } catch(e) {
            console.error(e);
        }
        return users;
    }

    private setStorageCurrUser(userInfo: Partial<IUserInfo>) {
        localStorage.setItem(this.storeCurrUserKey, JSON.stringify(userInfo));
    }

    private getStorageCurrUser() {
        let user: IUserInfo | null = null;
        try {
            const userData = localStorage.getItem(this.storeCurrUserKey);
            if (!userData) return null;
            user = JSON.parse(userData);
        } catch(e) {
            console.error(e);
        }
        return user;
    }

    private clearStorageCurrUser() {
        localStorage.removeItem(this.storeCurrUserKey);
    }

    public login(username: string, password: string) {
        const allUsers = this.getStorageSignupUsers();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const loginUser = allUsers.find(item => item.username === username && item.password === password);
                if (loginUser) {
                    const { id, username, avatar } = loginUser;
                    this.setStorageCurrUser({id, username, avatar});
                    resolve(loginUser);
                } else {
                    reject('用户名或密码错误');
                }
            }, 200);
        });
    }

    public signup(username: string, password: string) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const baseUser: Omit<IUserInfo, 'id' | 'roles' | 'realname'> = {
                    username,
                    avatar: '',
                };
                const newId = this.setStorageUser({
                    ...baseUser,
                    password,
                });
                const newUser = {
                    ...baseUser,
                    id: newId,
                };
                this.setStorageCurrUser(newUser);
                resolve(newUser);
            }, 200);
        });
    }

    public signout() {
        this.clearStorageCurrUser();
    }

    public fetchCurrUser(): Promise<IUserInfo | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.getStorageCurrUser());
            }, 200);
        });
    }
}

export const service = new MockService();