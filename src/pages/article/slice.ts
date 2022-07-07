import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IArticleData } from '../../service/interface';
import { Page } from '../../utils/constants';

export interface InitialState {
    data: IArticleData | null,
}

const initialState: InitialState = {
    data: null
};

const slice = createSlice({
    name: Page.Article,
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<IArticleData | null>) => {
            state.data = action.payload;
        },
    }
});

export default slice;