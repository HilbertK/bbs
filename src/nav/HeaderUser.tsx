import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/avatar/Avatar';
import { RootState } from '../store';
import { drawerWidth } from './constants';
import { Font, Palette } from '../base/style';
import { subRoutes, SubRouteType } from './sub-routes';
import { Login } from '../components/login';
import { logout } from '../store/user-slice';
import { Dispatch } from '@reduxjs/toolkit';
import { defaultAvatarSize } from '../components/avatar/DefaultAvatar';
import { actions } from '../store/menu-slice';

export const HeaderUser = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const currSubMenu = useSelector((state: RootState) => state.menu.currSubMenu);
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const navigate = useNavigate();
    const mineMenu = useMemo(() => subRoutes.map(({ checkFn, ...subRoute }, index) => ({
        ...subRoute,
        show: userInfo ? (checkFn ? checkFn(userInfo) : true) : false,
        handler: () => {
            const { type, path, key } = subRoute;
            switch (type) {
                case SubRouteType.Page:
                    setActiveIndex(index);
                    break;
                case SubRouteType.Signout:
                    dispatch(actions.setCurrSubMenu(null));
                    dispatch(actions.setTopSubMenu(null));
                    dispatch(logout(true));
                    return;
            }
            navigate(path);
        },
    })), [userInfo]);
    const findActiveIndex = () => mineMenu.findIndex(item => currSubMenu === item.key);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(findActiveIndex);
    const itemHandler = (handler: any) => () => {
        handler();
        setMenuVisible(false);
    };
    const openHandler = () => {
        if (userInfo?.username == null) {
            setLoginOpen(true);
            return;
        }
        setActiveIndex(findActiveIndex());
        setMenuVisible(true);
    };
    const onLoginModalClose = () => setLoginOpen(false);
    const renderAvatar = useMemo(() => (
        <Avatar
            url={userInfo?.avatar ?? ''}
            name={userInfo?.username ?? '登录'}
        />
    ), [userInfo]);
    return (
        <Box>
            <Box sx={AvatarWrapperStyle} onClick={openHandler}>{renderAvatar}</Box>
            <Login open={loginOpen} onClose={onLoginModalClose} />
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
                    <Box sx={drawerHeaderText}>{userInfo?.username}</Box>
                    {renderAvatar}
                </Box>
                <List>
                    {mineMenu.filter(item => item.show).map(({ name, handler, iconComp, key }, index) => (
                        <ListItem key={key} disablePadding>
                            <ListItemButton selected={index === activeIndex} onClick={itemHandler(handler)}>
                                <ListItemIcon>{iconComp}</ListItemIcon>
                                <ListItemText primary={name} />
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

const AvatarWrapperStyle = {
    borderRadius: `${defaultAvatarSize / 2}px`,
    border: '1px solid #fff',
};