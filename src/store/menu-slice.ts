import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { subPathKey, SubPathValue } from '../pages/sub/constants';
import { IUserInfo } from '../service/interface';
import { RoleEnum } from '../utils/auth/constants';
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
    checkFn?: (userRoles: string[], userInfo: IUserInfo | null) => boolean,
}

export const defaultTopMenuList = [Page.Home, Page.Category];

const isSuperUser = (userInfo: IUserInfo | null) => userInfo?.username === 'admin';
// TODO: 超级管理员先简单地用username === admin的判断
export const homeTopMenuDict: Record<string, MenuItem> = {
    [Page.Home]: {
        name: '首页',
        path: '/',
    },
    [Page.Category]: {
        name: '分类',
        path: `/${Page.Category}`,
    },
    [Page.Teams]: {
        name: '团队',
        path: `/${Page.Teams}`,
    },
    [Page.Publish]: {
        name: '发布',
        path: `/${Page.Publish}`,
    },
};

export const userTopMenuDict: Record<string, MenuItem> = {
    [SubPathValue.User]: {
        name: '用户管理',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.User}`,
    },
    [SubPathValue.Role]: {
        name: '角色管理',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.Role}`,
    },
};

export const flowTopMenuDict: Record<string, MenuItem> = {
    [SubPathValue.CreateFlows]: {
        name: '我发起的',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.CreateFlows}`,
    },
    [SubPathValue.HandleFlows]: {
        name: '我接单的',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.HandleFlows}`,
    },
    [SubPathValue.AllFlows]: {
        name: '全部工单',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.AllFlows}`,
        checkFn: (userRoles, userInfo) => isSuperUser(userInfo) || userRoles.includes(RoleEnum.WorkOrderAdmin),
    },
    [SubPathValue.Tipoff]: {
        name: '全部举报',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.Tipoff}`,
        checkFn: (userRoles, userInfo) => isSuperUser(userInfo) || userRoles.includes(RoleEnum.WorkOrderAdmin),
    },
};

export const subMenuDict: Record<string, MenuItem> = {
    [SubMenuEnum.Home]: {
        name: '线上中闻',
        path: '/',
        children: homeTopMenuDict,
        // TODO: 先限制除了超级管理员其他都不可见
        checkFn: (userRoles, userInfo) => isSuperUser(userInfo),
    },
    [SubMenuEnum.Mine]: {
        name: '个人中心',
        path: `/${Page.Mine}`,
    },
    [SubMenuEnum.User]: {
        name: '用户系统',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.User}`,
        children: userTopMenuDict,
        checkFn: (userRoles, userInfo) => isSuperUser(userInfo) || userRoles.includes(RoleEnum.UserCenterAdmin),
    },
    [SubMenuEnum.Flow]: {
        name: '工单系统',
        path: `/${Page.Sub}?${subPathKey}=${SubPathValue.CreateFlows}`,
        children: flowTopMenuDict,
        checkFn: (userRoles, userInfo) => isSuperUser(userInfo) || userRoles.includes(RoleEnum.Employee) || userRoles.includes(RoleEnum.WorkOrderAdmin),
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
            if (action.payload) {
                document.title = subMenuDict[action.payload].name;
            }
        },
        setTopSubMenu: (state, action: PayloadAction<TopMenu | null>) => {
            state.currTopMenu = action.payload;
        },
    },
});

export const actions = slice.actions;

export default slice;