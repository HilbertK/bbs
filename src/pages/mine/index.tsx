import { Box } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Palette, RoundCorner, Shadow } from '../../base/style';
import { RootState } from '../../store';
import { contentTop, contentWidth } from '../../ui/base-utils';

export const Mine: FC = () => {
    const userInfo = useSelector((state: RootState) => state.mine.userInfo);
    return (
        <Box sx={MineContainer}>
            <Box sx={ContentContainer}>
                <Box sx={InfoContainer}>

                </Box>
                <Box sx={DetailContainer}>

                </Box>
            </Box>
        </Box>
    );
};

const MineContainer = {
    padding: `${contentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
};

const ContentContainer = {
    width: `${contentWidth}px`,
    margin: '0 auto',
};

const InfoContainer = {
    width: '100%',
    background: '#fff',
    boxShadow: Shadow.Light,
    borderRadius: RoundCorner(1),
};

const DetailContainer = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
};