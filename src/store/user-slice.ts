import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo, LoginParams, ThirdLoginParams } from '../service/interface';
import { doLogout, getUserInfo, loginApi, thirdLogin, updateUserInfo, getUserRoles } from '../service/api';
import { TOKEN_KEY, USER_INFO_KEY } from '../utils/cache/enum';
import { getToken, setAuthCache } from '../utils/auth';
import { useMessage } from '../hooks/useMessage';

export interface InitialState {
    userInfo: IUserInfo | null,
    userRoles: string[],
    token: string | null,
    sessionTimeout: boolean,
    loading: boolean,
}

const initialState: InitialState = {
    userInfo: null,
    userRoles: [],
    token: getToken() || null,
    sessionTimeout: false,
    loading: false,
};

const { notification } = useMessage();

const requestFailed = (err: any) => {
    notification.error({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4,
    });
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<IUserInfo | null>) => {
            state.userInfo = action.payload;
            setAuthCache(USER_INFO_KEY, action.payload);
        },
        setUserRoles: (state, action: PayloadAction<string[]>) => {
            state.userRoles = action.payload;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            setAuthCache(TOKEN_KEY, action.payload);
        },
        setSessionTimeout: (state, action: PayloadAction<boolean>) => {
            state.sessionTimeout = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(getUserInfoAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserInfoAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getUserInfoAction.rejected, (state) => {
            state.loading = false;
        });
    }
});

export const logout = createAsyncThunk<any, boolean>(
    'user/logout',
    async (goLogin: boolean, { dispatch }) => {
        const token = getToken();
        if (token) {
            try {
                await doLogout();
            } catch {
                console.log('注销Token失败');
            }
        }
        dispatch(actions.setToken(null));
        setAuthCache(TOKEN_KEY, null);
        dispatch(actions.setSessionTimeout(false));
        dispatch(actions.setUserInfo(null));
        if (goLogin) {
            location.href = __base_name__ ? `/${__base_name__}/` : '/';
        } else {
            setTimeout(() => {
                location.reload();
            }, 300);
        }
    }
);

export const login = createAsyncThunk<any, LoginParams & { onLogin: () => void }>(
    'user/login',
    async (params, { getState, dispatch }) => {
        const { sessionTimeout } = getState() as InitialState;
        try {
            const data = await loginApi(params);
            const { token } = data;
            if (token == null) return;
            dispatch(actions.setToken(token));
            if (sessionTimeout) {
                dispatch(actions.setSessionTimeout(false));
            }
            params.onLogin();
            setTimeout(() => {
                location.reload();
            }, 300);
        } catch (error) {
            // do nothing
        }
    }
);

export const getUserInfoAction = createAsyncThunk<any, undefined>(
    'user/info',
    async (payload, { dispatch }) => {
        const token = getToken();
        if (!token) return null;
        dispatch(actions.setToken(token));
        const res = await getUserInfo();
        if (res && res.userInfo) {
            dispatch(actions.setUserInfo(res.userInfo));
            const userRoles = await getUserRoles({ userid: res.userInfo.id });
            dispatch(actions.setUserRoles(userRoles));
            return res.userInfo;
        }
        return null;
    }
);

export const updateUserInfoAction = createAsyncThunk<any, Partial<IUserInfo> & {
    id: string | number,
    onSuccess?: () => void,
}>(
    'user/update',
    async (payload, { dispatch }) => {
        await updateUserInfo(payload);
        notification.success({ message: '更新成功' });
        const res = await getUserInfo();
        if (res && res.userInfo) {
            dispatch(actions.setUserInfo(res.userInfo));
        }
        payload.onSuccess?.();
    }
);

export const thirdLoginAction = createAsyncThunk<any, ThirdLoginParams>(
    'user/thirdLogin',
    async (params, { getState, dispatch }) => {
        const { sessionTimeout } = getState() as InitialState;
        try {
            const data = await thirdLogin(params);
            const { token } = data;
            dispatch(actions.setToken(token));
            if (sessionTimeout) {
                dispatch(actions.setSessionTimeout(false));
            }
            notification.success({ message: '登录成功' });
            setTimeout(() => {
                location.reload();
            }, 300);
        } catch (err: any) {
            console.error(err);
            requestFailed(err);
        }
    }
);

export const actions = slice.actions;

export default slice;