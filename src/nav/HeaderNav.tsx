import { useCallback, useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Dark, Font, Palette, Shadow } from '../base/style';
import { ContentCenterStyle, headerMenuHeight } from '../ui/base-utils';
import { subMenuDict } from '../store/menu-slice';

export const HeaderNav = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const currSubMenu = useSelector((state: RootState) => state.menu.currSubMenu);
    const currTopMenu = useSelector((state: RootState) => state.menu.currTopMenu);
    const navigate = useNavigate();
    const tabList = useMemo(() => {
        if (!currSubMenu) return [];
        return Object.entries(subMenuDict[currSubMenu].children ?? {}).map(([key, { checkFn, ...item }]) => ({
            ...item,
            key,
            show: userInfo ? (checkFn ? checkFn(userInfo) : true) : false,
        }));
    }, [currSubMenu, userInfo]);
    const getNewIndex = () => {
        const newIndex = tabList.findIndex(tab => currTopMenu === tab.key);
        if (newIndex < 0) return false;
        return newIndex;
    };
    const [value, setValue] = useState<number | boolean>(getNewIndex);
    const onTabClick = useCallback((link: string) => () => {
        navigate(link);
    }, []);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    useEffect(() => {
        setValue(getNewIndex());
    }, [currTopMenu, tabList]);
    return (
        <Tabs
            value={value}
            onChange={handleChange}
            sx={{
                ...TabsBaseStyle,
                zIndex: 1,
                position: 'relative',
                backgroundColor: Dark.Gray[400],
                boxShadow: Shadow.Large,
                borderBottom: `1px solid ${Palette.Fill.Normal}`,
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
                        fontWeight: 900,
                        height: `${headerMenuHeight}px`,
                        padding: '20px 16px',
                        ...TabBaseStyle
                    }}
                    key={tab.name}
                    onClick={onTabClick(tab.path)}
                    label={tab.name}
                />
            ))}
        </Tabs>
    );
};

const TabBaseStyle = {
    color: '#fff',
    opacity: 1,
    '&.Mui-selected': {
        background: Palette.Brand.Normal,
    },
    '&:hover': {
        color: Palette.Brand.Hover,
    },
    '&.Mui-selected:hover': {
        color: '#fff'
    },
};

const TabsBaseStyle = {
    '& .MuiTabs-indicator': {
        display: 'none'
    },
};