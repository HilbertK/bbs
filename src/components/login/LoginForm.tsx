import { Box, Button, TextField } from '@mui/material';
import { Dispatch } from '@reduxjs/toolkit';
import { Divider } from 'antd';
import { FC, useState, ChangeEventHandler, KeyboardEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Font, Palette } from '../../base/style';
import { getCodeInfo } from '../../service/api';
import { login } from '../../store/user-slice';
import { InputTextStyle, SubmitButtonStyle } from './constants';
import { ThirdModal } from './ThirdModal';

export const LoginForm: FC<{
    onLogin: () => void,
}> = props => {
    const { onLogin } = props;
    const dispatch: Dispatch<any> = useDispatch();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [code ,setCode] = useState<string>('');
    const [checkKey ,setCheckKey] = useState<number>(0);
    const [codeImg, setCodeImg] = useState<string>('');
    const [usernameHelptext, setUsernameHelptext] = useState<string>('');
    const [passwordHelptext, setPasswordHelptext] = useState<string>('');
    const [codeHelptext, setCodeHelptext] = useState<string>('');
    const onUsernameChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        if (newValue !== '') setUsernameHelptext('');
        setUsername(newValue);
    };
    const onPasswordChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        if (newValue !== '') setPasswordHelptext('');
        setPassword(newValue);
    };
    const onCodeChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        if (newValue !== '') setCodeHelptext('');
        setCode(newValue);
    };
    const getUsernameError = (text: string) => {
        if (text === '') return '请输入用户名';
        return '';
    };
    const getPasswordError = (text: string) => {
        if (text === '') return '请输入密码';
        return '';
    };
    const getCodeError = (text: string) => {
        if (text === '') return '请输入验证码';
        return '';
    };
    const onLoginHandler = () => {
        const uError = getUsernameError(username);
        const pError = getPasswordError(password);
        const cError = getCodeError(password);
        if (!uError && !pError && !cError) {
            dispatch(login({
                username,
                password,
                captcha: code,
                checkKey,
                onLogin,
            }));
        } else {
            setUsernameHelptext(uError);
            setPasswordHelptext(pError);
            setCodeHelptext(cError);
        }
    };
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            onLoginHandler();
        }
    };
    const handleChangeCheckCode = async () => {
        const now = Date.now();
        setCheckKey(now);
        const res = await getCodeInfo(now);
        setCodeImg(res);
    };
    useEffect(() => {
        const fetch = async () => {
            await handleChangeCheckCode();
        };
        void fetch();
    }, []);
    return (
        <Box
            sx={Container}
            onKeyDown={onKeyDown}
        >
            <TextField
                maxRows={1}
                label='账号'
                type='text'
                sx={InputTextStyle}
                error={usernameHelptext !== ''}
                helperText={usernameHelptext}
                value={username}
                variant='standard'
                onChange={onUsernameChange}
            />
            <TextField
                maxRows={1}
                sx={InputTextStyle}
                type='password'
                label='密码'
                error={passwordHelptext !== ''}
                helperText={passwordHelptext}
                value={password}
                variant='standard'
                onChange={onPasswordChange}
            />
            <Box sx={CodeContainer}>
                <TextField
                    maxRows={1}
                    sx={{...InputTextStyle, flexGrow: 1}}
                    type='text'
                    label='验证码'
                    error={codeHelptext !== ''}
                    helperText={codeHelptext}
                    value={code}
                    variant='standard'
                    onChange={onCodeChange}
                />
                <Box sx={{flexShrink: 0, marginLeft: '10px'}} component='img' src={codeImg} onClick={handleChangeCheckCode} />
            </Box>
            <Divider style={{
                ...Font.AiderMedium,
                color: Palette.Fill.Normal
            }}>其他登录方式</Divider>
            <ThirdModal />
            <Button
                variant='contained'
                onClick={onLoginHandler}
                sx={SubmitButtonStyle}
            >登录</Button>
        </Box>
    );
};

const Container = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
};

const CodeContainer = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px'
};