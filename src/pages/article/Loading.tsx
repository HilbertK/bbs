import {Box, Skeleton} from '@mui/material';
import React from 'react';
import { articleWidth, catalogWidth } from './constants';

export const Loading: React.FC = () => (
    <>
        <Box sx={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: `${articleWidth}px`, marginRight: '40px' }}>
                <Skeleton variant='rectangular' height='40px' />
                <Skeleton variant='rectangular' height='80vh' sx={{ marginTop: '20px' }} />
            </Box>
            <Box sx={{ width: `${catalogWidth}px` }}>
                <Skeleton variant='rectangular' height='100%' />
            </Box>
        </Box>
    </>
);