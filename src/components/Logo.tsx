import { Box, SxProps, Theme } from '@mui/material';
import { FC } from 'react';
import LogoImg from '../assets/common/logo.png';

export const Logo: FC<{
    sx?: SxProps<Theme>,
}> = ({ sx = {} }) => <Box sx={{ ...LogoStyle, ...sx }} component='img' src={LogoImg} />;

const LogoStyle = {
    height: '60px',
    width: 'auto',
};