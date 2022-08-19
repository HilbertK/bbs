import { Palette, RoundCorner } from '../../base/style';

export const loginContentWidth = 400;
export enum LoginMode {
    Login='login',
    Signup='Signup'
}

export enum UserType {
    NaturalPerson='natural_person',
    LegalPerson='legal_person'
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
    backgroundColor: Palette.Brand.Normal,
    '&:hover': {
        backgroundColor: Palette.Brand.Hover,
    },
    padding: '4px 15px'
};

export const InputTextStyle = {
    width: '100%',
    paddingBottom: '20px',
    '& .MuiFormHelperText-root.Mui-error': {
        position: 'absolute',
        bottom: 0
    }
};