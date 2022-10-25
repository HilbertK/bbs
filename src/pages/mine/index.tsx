import { Box } from '@mui/material';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Palette } from '../../base/style';
import { RootState } from '../../store';
import { contentMinHeight } from '../../ui/base-utils';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { MineInfo } from '../../components/userinfo/MineInfo';
import { mineCenterContentTop } from '../../components/userinfo/constants';

export const Mine: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.setCurrSubMenu(SubMenuEnum.Mine));
        dispatch(actions.setTopSubMenu(null));
    }, []);
    if (userInfo === null) return null;
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