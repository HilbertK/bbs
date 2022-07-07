import { Palette, RoundCorner } from '../../base/style';
import { calcWidth } from '../../utils/util';

export const loginContentWidth = calcWidth(400);
export enum LoginMode {
    Login='login',
    Signup='Signup'
}

export const LoginDict = {
    [LoginMode.Login]: {
        key: LoginMode.Login,
        title: '登录'
    },
    [LoginMode.Signup]: {
        key: LoginMode.Signup,
        title: '注册'
    },
};
export const SubmitButtonStyle = {
    marginTop: '10px',
    width: '100%',
    borderRadius: RoundCorner(1),
    backgroundColor: Palette.Base.Clicked,
    '&:hover': {
        backgroundColor: Palette.Base.Hover,
    },
    padding: '4px 15px'
};

export const InputTextStyle = {
    paddingBottom: '20px',
    '& .MuiFormHelperText-root.Mui-error': {
        position: 'absolute',
        bottom: 0
    }
};