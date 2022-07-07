import { Box, Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useState, ChangeEventHandler, KeyboardEvent } from 'react';
import { service } from '../../service/mock-service';
import { InputTextStyle, LoginDict, LoginMode, SubmitButtonStyle } from './constants';

export const LoginForm: FC<{
    mode: LoginMode,
    onLogin: () => void,
}> = props => {
    const { mode, onLogin } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [usernameHelptext, setUsernameHelptext] = useState<string>('');
    const [passwordHelptext, setPasswordHelptext] = useState<string>('');
    const onUsernameChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        if (newValue !== '') setUsernameHelptext('');
        setUsername(newValue);
    };
    const onPasswordChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        if (newValue !== '') setPasswordHelptext('');
        setPassword(event.target.value);
    };
    const getUsernameError = (text: string) => {
        if (text === '') return '请输入用户名';
        return '';
    };
    const getPasswordError = (text: string) => {
        if (text === '') return '请输入密码';
        return '';
    };
    const onLoginHandler = async () => {
        const uError = getUsernameError(username);
        const pError = getPasswordError(password);
        if (!uError && !pError) {
            try {
                if (LoginDict[mode].key === LoginMode.Login) {
                    await service.login(username, password);
                } else {
                    await service.signup(username, password);
                }
                onLogin();
            } catch (e: any) {
                console.error(e);
                enqueueSnackbar(e, { variant: 'error' });
            }
        } else {
            setUsernameHelptext(uError);
            setPasswordHelptext(pError);
        }
    };
    const onKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            await onLoginHandler();
        }
    };
    return (
        <Box
            sx={Container}
            onKeyDown={onKeyDown}
        >
            <TextField
                maxRows={1}
                label='用户名'
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
            <Button
                variant='contained'
                onClick={onLoginHandler}
                sx={SubmitButtonStyle}
            >{LoginDict[mode].title}</Button>
        </Box>
    );
};

const Container = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
};