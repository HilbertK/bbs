import { Box } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Page } from '../../utils/constants';
import { TableList } from '../../components/articles/TableList';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { useMenu } from '../hooks/useMenu';

export const Home: FC = () => {
    const dispatch = useDispatch();
    useMenu(SubMenuEnum.Home, Page.Home);
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