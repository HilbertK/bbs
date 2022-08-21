import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { RootState } from '../../store';
import { drawerWidth } from './constants';
import { Font, Palette } from '../../base/style';
import { subRoutes, SubRouteType } from './sub-routes';
import { Login } from '../../components/login';
import { logout } from '../../store/user-slice';
import { Dispatch } from '@reduxjs/toolkit';
import { defaultAvatarSize } from '../../components/avatar/DefaultAvatar';

export const HeaderUser: FC<{
    onRouteChange: () => void,
}> = props => {
    const { onRouteChange } = props;
    const dispatch: Dispatch<any> = useDispatch();
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const navigate = useNavigate();
    const mineMenu = subRoutes.map((subRoute, index) => ({
        ...subRoute,
        handler: () => {
            const { type, link } = subRoute;
            switch (type) {
                case SubRouteType.Page:
                    setActiveIndex(index);
                    break;
                case SubRouteType.Signout:
                    dispatch(logout(false));
                    return;
            }
            onRouteChange();
            navigate(link);
        },
    }));
    const findActiveIndex = () => mineMenu.findIndex(item => `${location.pathname}${location.search}` === item.link);
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
    const renderAvatar = () => (
        <Avatar
            url={userInfo?.avatar ?? ''}
            name={userInfo?.username ?? '登录'}
        />
    );
    return (
        <Box>
            <Box sx={AvatarWrapperStyle} onClick={openHandler}>{renderAvatar()}</Box>
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
                    {renderAvatar()}
                </Box>
                <List>
                    {mineMenu.map(({ title, handler, iconComp }, index) => (
                        <ListItem key={title} disablePadding>
                            <ListItemButton selected={index === activeIndex} onClick={itemHandler(handler)}>
                                <ListItemIcon>{iconComp}</ListItemIcon>
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

const AvatarWrapperStyle = {
    borderRadius: `${defaultAvatarSize / 2}px`,
    border: '1px solid #fff',
};