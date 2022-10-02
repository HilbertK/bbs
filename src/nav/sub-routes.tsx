import { Page } from '../utils/constants';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { MenuItem, subMenuDict, SubMenuEnum } from '../store/menu-slice';

export enum SubRouteType {
    Page = 'page',
    Signout = 'signout'
}

type ISubRoute = MenuItem & {
    key: SubMenuEnum,
    type: SubRouteType,
    iconComp: JSX.Element,
};

export const subRoutes: Array<ISubRoute> = [
    {
        ...subMenuDict[SubMenuEnum.Home],
        key: SubMenuEnum.Home,
        type: SubRouteType.Page,
        iconComp: <HomeIcon />
    },
    {
        ...subMenuDict[SubMenuEnum.Mine],
        key: SubMenuEnum.Mine,
        type: SubRouteType.Page,
        iconComp: <PersonIcon />
    },
    {
        ...subMenuDict[SubMenuEnum.User],
        key: SubMenuEnum.User,
        type: SubRouteType.Page,
        iconComp: <ManageAccountsIcon />
    },
    {
        ...subMenuDict[SubMenuEnum.Flow],
        key: SubMenuEnum.Flow,
        type: SubRouteType.Page,
        iconComp: <WysiwygIcon />
    },
    {
        name: '退出登录',
        key: SubMenuEnum.Logout,
        // TODO: 正式环境需调整
        path: `/center/${Page.Login}`,
        type: SubRouteType.Signout,
        iconComp: <PowerSettingsNewIcon />,
    }
];