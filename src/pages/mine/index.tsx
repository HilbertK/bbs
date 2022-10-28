import { Box } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Palette } from '../../base/style';
import { RootState } from '../../store';
import { contentMinHeight } from '../../ui/base-utils';
import { SubMenuEnum } from '../../store/menu-slice';
import { MineInfo } from '../../components/userinfo/MineInfo';
import { mineCenterContentTop } from '../../components/userinfo/constants';
import { useMenu } from '../hooks/useMenu';

export const Mine: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    useMenu(SubMenuEnum.Mine, null);
    return (
        <Box sx={MineContainer}>
            <MineInfo userInfo={userInfo} />
        </Box>
    );
};

const MineContainer = {
    minHeight: contentMinHeight,
    padding: `${mineCenterContentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
};