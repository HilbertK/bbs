import { Box, Tab, Tabs, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, RoundCorner, Shadow } from '../../base/style';
import { TabBaseStyle, TabsBaseStyle } from '../../ui/base-utils';
import { Theme } from '../../ui/mui-utils';
import { loginContentWidth, LoginDict, LoginMode } from './constants';
import { LoginForm } from './LoginForm';

const tabList = [LoginDict[LoginMode.Login], LoginDict[LoginMode.Signup]];
export const Login: FC = () => {
    const [checkedTabs, setCheckedTabs] = useState<number>(0);
    const navigate = useNavigate();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCheckedTabs(newValue);
    };
    const onLogin = () => {
        navigate('/');
    };
    return (
        <SnackbarProvider
            maxSnack={1}
            preventDuplicate
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transitionDuration={{ appear: 200, enter: 100, exit: 200 }}
            autoHideDuration={2000}
        >
            <ThemeProvider theme={Theme}>
                <Box sx={Container}>
                    <Box sx={Content}>
                        <Tabs sx={TabsBaseStyle} value={checkedTabs} onChange={handleChange}>
                            {tabList.map(({ title, key }) => (
                                <Tab sx={TabBaseStyle} key={key} label={title} />
                            ))}
                        </Tabs>
                        <LoginForm mode={tabList.find((item, index) => index === checkedTabs)!.key} onLogin={onLogin} />
                    </Box>
                </Box>
            </ThemeProvider>
        </SnackbarProvider>
    );
};

const Container = {
    height: '100%',
    width: '100%',
    backgroundColor: Palette.Fill.DarkHover,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const Content = {
    width: `${loginContentWidth}px`,
    backgroundColor: '#fff',
    boxShadow: Shadow.Large,
    borderRadius: RoundCorner(2),
    padding: '10px 24px 30px'
};