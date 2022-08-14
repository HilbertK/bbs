// config redux store
import {configureStore, combineReducers, Store} from '@reduxjs/toolkit';
import categorySlice, {InitialState as CategoryInitialState} from '../pages/category/slice';
import homeSlice, {InitialState as HomeInitialState} from '../pages/home/slice';
import mineSlice, {InitialState as MineInitialState} from '../pages/mine/slice';
import publishSlice, {InitialState as PublishInitialState} from '../pages/publish/slice';
import articleSlice, {InitialState as ArticleInitialState} from '../pages/article/slice';
import userSlice, {InitialState as UserInitialState} from './user-slice';
import {Page} from '../utils/constants';

const createStore = () => configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: {},
    reducer: combineReducers({
        [Page.Category]: categorySlice.reducer,
        [Page.Home]: homeSlice.reducer,
        [Page.Mine]: mineSlice.reducer,
        [Page.Publish]: publishSlice.reducer,
        [Page.Article]: articleSlice.reducer,
        user: userSlice.reducer,
    }),
});

export const store: Store<RootState> = createStore();

export interface RootState {
    [Page.Category]: CategoryInitialState,
    [Page.Home]: HomeInitialState,
    [Page.Mine]: MineInitialState,
    [Page.Publish]: PublishInitialState,
    [Page.Article]: ArticleInitialState,
    user: UserInitialState,
}
