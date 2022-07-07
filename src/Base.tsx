import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Tab, Box, Skeleton } from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Page, PageTitle } from './utils/constants';
import { Font, Palette, Shadow } from './base/style';
import { ContentCenterStyle, contentWidth, headerMenuHeight, TabBaseStyle, TabsBaseStyle } from './ui/base-utils';
import { HeaderUser } from './pages/mine/HeaderUser';
import 'moment/locale/zh-cn';
import { service } from './service/mock-service';
import mineSlice from './pages/mine/slice';
import { RootState } from './store';

moment.locale('zh-cn');
const tabList = [{
    name: PageTitle[Page.Home],
    link: '/'
}, {
    name: PageTitle[Page.Category],
    link: `/${Page.Category}`
}, {
    name: PageTitle[Page.Publish],
    link: `/${Page.Publish}`
}];

function Base() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const [value, setValue] = useState<number | boolean>(() => {
        const newIndex = tabList.findIndex(tab => location.pathname === tab.link);
        if (newIndex < 0) return false;
        return newIndex;
    });
    const onTabClick = useCallback((link: string) => () => {
        navigate(link);
    }, []);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const setValueEmpty = () => setValue(false);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const user = await service.fetchCurrUser();
            if (user == null) {
                navigate(`/${Page.Login}`);
            } else {
                dispatch(mineSlice.actions.setUserInfo(user));
            }
            setLoading(false);
        };
        void fetch();
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
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                sx={{
                    ...TabsBaseStyle,
                    position: 'relative',
                    backgroundColor: '#fff',
                    boxShadow: Shadow.Light,
                    '& .MuiTabs-flexContainer': {
                        ...ContentCenterStyle,
                        width: '100%',
                    }
                }}
                textColor='inherit'
            >
                {tabList.map(tab => (
                    <Tab
                        sx={{
                            ...Font.TitleMediumBold,
                            height: `${headerMenuHeight}px`,
                            padding: '20px 16px',
                            ...TabBaseStyle
                        }}
                        key={tab.name}
                        onClick={onTabClick(tab.link)}
                        label={tab.name}
                    />
                ))}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: '25px',
                    height: '100%',
                    cursor: 'pointer',
                    ...ContentCenterStyle,
                }}><HeaderUser onRouteChange={setValueEmpty} /></Box>
            </Tabs>
            <Outlet />
        </>
    );
}

const LoadingContainer = {
    width: '100%',
};

const LoadingContent = {
    width: `${contentWidth}px`,
    margin: '0 auto',
    padding: '30px 0'
};

export default Base;
