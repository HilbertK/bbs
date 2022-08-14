import React from 'react';
import { Page } from '../../utils/constants';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PersonIcon from '@mui/icons-material/Person';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { subPathKey, SubPathValue } from '../sub/constants';

export enum SubRouteType {
    Page = 'page',
    Signout = 'signout'
}

interface ISubRoute {
    title: string,
    link: string,
    type: SubRouteType,
    iconComp: JSX.Element,
}

export const subRoutes: Array<ISubRoute> = [
    {
        title: '个人中心',
        link: `/${Page.Mine}`,
        type: SubRouteType.Page,
        iconComp: <PersonIcon />
    },
    {
        title: '用户管理',
        link: `/${Page.Sub}?${subPathKey}=${SubPathValue.User}`,
        type: SubRouteType.Page,
        iconComp: <ManageAccountsIcon />
    },
    {
        title: '权限管理',
        link: `/${Page.Sub}?${subPathKey}=${SubPathValue.Role}`,
        type: SubRouteType.Page,
        iconComp: <PermContactCalendarIcon />
    },
    {
        title: '工单系统',
        link: `/${Page.Sub}`,
        type: SubRouteType.Page,
        iconComp: <WysiwygIcon />
    },
    {
        title: '退出登录',
        type: SubRouteType.Signout,
        link: `/${Page.Login}`,
        iconComp: <PowerSettingsNewIcon />,
    }
];