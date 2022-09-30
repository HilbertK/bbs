import { useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ContentCenterStyle, contentWidth } from './ui/base-utils';
import { HeaderUser } from './nav/HeaderUser';
import 'moment/locale/zh-cn';
import { getUserInfoAction } from './store/user-slice';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Logo } from './components/Logo';
import { HeaderNav } from './nav/HeaderNav';

moment.locale('zh-cn');

function Base() {
    const dispatch: Dispatch<any> = useDispatch();
    const loading = useSelector((state: RootState) => state.user.loading);
    useEffect(() => {
        dispatch(getUserInfoAction());
    }, []);
    if (loading) return (
        <Box sx={LoadingContainer}>
            <Skeleton sx={{ transform: 'none', borderRadius: 'unset' }} width='100%' height='64px' />
            <Box sx={LoadingContent}>
                <Skeleton variant='rectangular' width='100%' height='80vh' />
            </Box>
        </Box>
    );
    return (
        <Box sx={ContainerStyle}>
            <Box sx={{ position: 'relative' }}>
                <Logo sx={LogoStyle} />
                <HeaderNav />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: '25px',
                    zIndex: 1,
                    height: '100%',
                    cursor: 'pointer',
                    ...ContentCenterStyle,
                }}>
                    <HeaderUser />
                </Box>
            </Box>
            <Outlet />
        </Box>
    );
}

const ContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '100vh'
};

const LoadingContainer = {
    width: '100%',
};

const LoadingContent = {
    width: `${contentWidth}px`,
    margin: '0 auto',
    padding: '30px 0'
};

const LogoStyle = {
    position: 'absolute',
    left: '50px',
    top: '50%',
    zIndex: 2,
    transform: 'translate(0, -50%)',
};

export default Base;
