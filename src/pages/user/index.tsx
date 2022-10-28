import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Palette } from '../../base/style';
import { contentMinHeight } from '../../ui/base-utils';
import { SubMenuEnum } from '../../store/menu-slice';
import { MineInfo } from '../../components/userinfo/MineInfo';
import { mineCenterContentTop } from '../../components/userinfo/constants';
import { IUserInfo } from '../../service/interface';
import { Empty, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';

export const User: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const [searchParams] = useSearchParams();
    useMenu(SubMenuEnum.Home, null);
    useEffect(() => {
        const userId = searchParams.get('id');
        if (userId == null) return;
        const fetch = () => {
            setLoading(true);

            setLoading(false);
        };
        void fetch();
    }, []);
    return (
        <Box sx={MineContainer}>
            {!loading ? (userInfo ? <MineInfo userInfo={userInfo} /> : <Empty />) : <Spin />}
        </Box>
    );
};

const MineContainer = {
    minHeight: contentMinHeight,
    padding: `${mineCenterContentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
};