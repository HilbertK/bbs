import { Box } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Page } from '../../utils/constants';
import { TableList } from '../../components/articles/TableList';
import { actions, SubMenuEnum } from '../../store/menu-slice';

export const Home: FC = () => {
    const list = useSelector((state: RootState) => state.home.list);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.setCurrSubMenu(SubMenuEnum.Home));
        dispatch(actions.setTopSubMenu(Page.Home));
    }, []);
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