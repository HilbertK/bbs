import { CategoryItem } from '../base/interface';

export enum Page {
    Home = 'home',
    Category = 'category',
    Mine = 'mine',
    Publish = 'publish',
    Article = 'article',
    Login = 'login',
    Sub = 'sub',
}

export const PageTitle = {
    [Page.Home]: '首页',
    [Page.Category]: '分类',
    [Page.Publish]: '发布',
};

export enum Category {
    Anli = 'anli',
    AnliXingfa = 'anli_xingfa',
    AnliMinfa = 'anli_minfa',
    AnliQita = 'anli_qita',
    Xingzheng = 'xingzheng',
    Renshi = 'renshi',
    Qita = 'qita'
}

type CategoryValue = Omit<CategoryItem, 'children'>;

export const CategoryDict: Record<Category, CategoryValue> = {
    [Category.Anli]: {
        value: Category.Anli,
        label: '案例',
    },
    [Category.AnliXingfa]: {
        value: Category.AnliXingfa,
        label: '刑法'
    },
    [Category.AnliMinfa]: {
        value: Category.AnliMinfa,
        label: '民法'
    },
    [Category.AnliQita]: {
        value: Category.AnliQita,
        label: '其他'
    },
    [Category.Xingzheng]: {
        value: Category.Xingzheng,
        label: '行政'
    },
    [Category.Renshi]: {
        value: Category.Renshi,
        label: '人事'
    },
    [Category.Qita]: {
        value: Category.Qita,
        label: '其他'
    }
};

export const CategoryList = [
    {
        ...CategoryDict[Category.Anli],
        children: [Category.AnliMinfa, Category.AnliXingfa, Category.AnliQita].map(item => CategoryDict[item])
    },
    CategoryDict[Category.Xingzheng],
    CategoryDict[Category.Renshi],
    CategoryDict[Category.Qita],
];