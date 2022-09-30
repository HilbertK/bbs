import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { subPathKey, SubPathValue } from '../pages/sub/constants';
import { IUserInfo } from '../service/interface';
import { Page } from '../utils/constants';

export enum SubMenuEnum {
    Home = 'home',
    Mine = 'mine',
    User = 'user',
    Flow = 'flow',
    Logout = 'logout'
}

export interface MenuItem {
    name: string,
    path: string,
    children?: Record<string, MenuItem>,
    checkFn?: (userInfo: IUserInfo) => boolean,
}

export const defaultTopMenuList = [Page.Home, Page.Category];

export const homeTopMenuDict: Record<string, MenuItem> = {
    [Page.Home]: {
        name: '首页',
        path: `/${Page.Home}`,
    },
    [Page.Category]: {
        name: '分类',
        path: `/${Page.Category}`,
    },
    [Page.Publish]: {
        name: '发布',
        path: `/${Page.Publish}`,
        checkFn: userInfo => !!userInfo.id,
    },
};

export const userTopMenuDict = {
    [SubPathValue.User]: {
        name: '用户管理',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.User}`,
    },
    [SubPathValue.Role]: {
        name: '角色管理',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.Role}`,
    },
};

export const flowTopMenuDict = {
    [SubPathValue.AllFlows]: {
        name: '全部工单',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.AllFlows}`,
    },
    [SubPathValue.CreateFlows]: {
        name: '我发起的',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.CreateFlows}`,
    },
    [SubPathValue.HandleFlows]: {
        name: '我接单的',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.HandleFlows}`,
    },
};

export const subMenuDict: Record<string, MenuItem> = {
    [SubMenuEnum.Home]: {
        name: '线上中闻',
        path: '/',
        children: homeTopMenuDict
    },
    [SubMenuEnum.Mine]: {
        name: '个人中心',
        path: `/${Page.Mine}`,
    },
    [SubMenuEnum.User]: {
        name: '用户系统',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.User}`,
        children: userTopMenuDict,
        checkFn: userInfo => !!userInfo.id
    },
    [SubMenuEnum.Flow]: {
        name: '工单系统',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.AllFlows}`,
        children: flowTopMenuDict,
    }
};

export const getSubMenuByTopMenu = (topMenu: TopMenu) => {
    let subMenu: SubMenuEnum | null = null;
    Object.entries(subMenuDict).forEach(([key, value]) => {
        Object.keys(value.children ?? {}).forEach(cKey => {
            if (cKey === topMenu) {
                subMenu = key as SubMenuEnum;
            }
        });
    });
    return subMenu;
};

export type TopMenu = Page | SubPathValue;

export interface InitialState {
    currSubMenu: SubMenuEnum | null,
    currTopMenu: TopMenu | null,
}

const initialState: InitialState = {
    currSubMenu: SubMenuEnum.Home,
    currTopMenu: Page.Home,
};

const slice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setCurrSubMenu: (state, action: PayloadAction<SubMenuEnum | null>) => {
            state.currSubMenu = action.payload;
        },
        setTopSubMenu: (state, action: PayloadAction<TopMenu | null>) => {
            state.currTopMenu = action.payload;
        },
    },
});

export const actions = slice.actions;

export default slice;