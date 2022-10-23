import { Box, SxProps, Theme } from '@mui/material';
import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../assets/common/logo.png';

export const Logo: FC<{
    sx?: SxProps<Theme>,
}> = ({ sx = {} }) => {
    const navigate = useNavigate();
    const backHome = useCallback(() => {
        navigate('/');
    }, []);
    return <Box onClick={backHome} sx={{ ...LogoStyle, ...sx }} component='img' src={LogoImg} />
};

const LogoStyle = {
    height: '60px',
    cursor: 'pointer',
    width: 'auto',
};