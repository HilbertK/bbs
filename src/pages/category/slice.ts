import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IArticleData } from '../../service/interface';
import { Page } from '../../utils/constants';

export interface InitialState {
    list: Array<IArticleData>,
}

const initialState: InitialState = {
    list: []
};

const slice = createSlice({
    name: Page.Category,
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<Array<IArticleData>>) => {
            state.list = action.payload;
        },
    }
});

export default slice;