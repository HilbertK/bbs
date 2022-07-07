import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { service } from '../../service/mock-service';
import { RootState } from '../../store';
import { Page } from '../../utils/constants';
import { drawerWidth } from './constants';
import mineSlice from './slice';

export const HeaderUser: FC = () => {
    const userInfo = useSelector((state: RootState) => state.mine.userInfo);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mineMenu = [
        {
            title: '个人中心',
            handler: () => navigate(`/${Page.Mine}`),
        },
        {
            title: '工单系统',
            handler: () => navigate(`/`),
        },
        {
            title: '退出登录',
            handler: () => {
                service.signout();
                navigate(`${Page.Login}`);
                dispatch(mineSlice.actions.setUserInfo(null));
            }
        }
    ];
    const itemHandler = (handler: any) => () => {
        handler();
        setMenuVisible(false);
    };
    const renderAvatar = () => (
        <Avatar
            url={userInfo?.avatar ?? ''}
            name={userInfo?.name ?? '登录'}
        />
    );
    return (
        <Box>
            <Box onClick={() => setMenuVisible(true)}>{renderAvatar()}</Box>
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
                    <Box>{userInfo?.name}</Box>
                    {renderAvatar()}
                </Box>
                <List>
                    {mineMenu.map(({ title, handler }) => (
                        <ListItem key={title} disablePadding>
                            <ListItemButton onClick={itemHandler(handler)}>
                                <ListItemText sx={{textAlign: 'center'}} primary={title} />
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
