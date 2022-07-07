import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { service } from '../../service/mock-service';
import { RootState } from '../../store';
import { Page } from '../../utils/constants';
import { drawerWidth } from './constants';
import mineSlice from './slice';
import { Font, Palette } from '../../base/style';

export const HeaderUser: FC<{
    onRouteChange: () => void,
}> = props => {
    const { onRouteChange } = props;
    const userInfo = useSelector((state: RootState) => state.mine.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mineMenu = [
        {
            title: '个人中心',
            link: `/${Page.Mine}`,
            handler: () => {
                onRouteChange();
                navigate(`/${Page.Mine}`);
                setActiveIndex(0);
            },
            icon: <PersonIcon />
        },
        {
            title: '工单系统',
            link: `/${Page.Mine}`,
            handler: () => {
                onRouteChange();
                navigate(`/`);
                setActiveIndex(1);
            },
            icon: <WysiwygIcon />
        },
        {
            title: '退出登录',
            link: null,
            icon: <PowerSettingsNewIcon />,
            handler: () => {
                service.signout();
                onRouteChange();
                navigate(`${Page.Login}`);
                dispatch(mineSlice.actions.setUserInfo(null));
            }
        }
    ];
    const findActiveIndex = () => mineMenu.findIndex(item => location.pathname === item.link);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(findActiveIndex);
    const itemHandler = (handler: any) => () => {
        handler();
        setMenuVisible(false);
    };
    const openHandler = () => {
        setActiveIndex(findActiveIndex());
        setMenuVisible(true);
    };
    const renderAvatar = () => (
        <Avatar
            url={userInfo?.avatar ?? ''}
            name={userInfo?.name ?? '登录'}
        />
    );
    return (
        <Box>
            <Box onClick={openHandler}>{renderAvatar()}</Box>
            <Drawer
                anchor='right'
                open={menuVisible}
                onClose={() => setMenuVisible(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        marginTop: 0,
                        width: `${drawerWidth}px`
                    }
                }}
            >
                <Box sx={drawerHeader}>
                    <Box sx={drawerHeaderText}>{userInfo?.name}</Box>
                    {renderAvatar()}
                </Box>
                <List>
                    {mineMenu.map(({ title, handler, icon }, index) => (
                        <ListItem key={title} disablePadding>
                            <ListItemButton selected={index === activeIndex} onClick={itemHandler(handler)}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};

const drawerHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 25px',
};

const drawerHeaderText = {
    ...Font.TitleMediumBold,
    color: Palette.Text.Title
};