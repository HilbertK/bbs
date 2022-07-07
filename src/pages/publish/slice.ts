import { createSlice } from '@reduxjs/toolkit';
import { Page } from '../../utils/constants';

export interface InitialState {

}

const initialState: InitialState = {

};

const slice = createSlice({
    name: Page.Publish,
    initialState,
    reducers: {
    }
});

export default slice;