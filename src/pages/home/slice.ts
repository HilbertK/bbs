import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IArticle } from '../../service/interface';
import { Page } from '../../utils/constants';

export interface InitialState {
    list: Array<IArticle>,
}

const initialState: InitialState = {
    list: []
};

const slice = createSlice({
    name: Page.Home,
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<Array<IArticle>>) => {
            state.list = action.payload;
        },
    }
});

export default slice;