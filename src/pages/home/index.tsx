import { Box } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { service } from '../../service/mock-service';
import homeSlice from './slice';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';
import { Page } from '../../utils/constants';
import { TableList } from '../../components/articles/TableList';

export const Home: FC = () => {
    const list = useSelector((state: RootState) => state.home.list);
    return (
        <Box>
            <TableList />
        </Box>
    );
};

const ItemContainer = {
    display: 'flex',
    alignItems: 'center',
};