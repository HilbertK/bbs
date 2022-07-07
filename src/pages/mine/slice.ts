import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo } from '../../service/interface';
import { Page } from '../../utils/constants';

export interface InitialState {
    userInfo: IUserInfo | null,
}

const initialState: InitialState = {
    userInfo: null,
};

const slice = createSlice({
    name: Page.Mine,
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<IUserInfo | null>) => {
            state.userInfo = action.payload;
        },
    }
});

export default slice;