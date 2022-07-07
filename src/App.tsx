import React from 'react';
import { ThemeProvider } from '@mui/material';
import { Theme } from './ui/mui-utils';
import { Provider } from 'react-redux';
import { store } from './store';
import { SnackbarProvider } from 'notistack';
import 'moment/locale/zh-cn';
import Base from './Base';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={Theme}>
                <SnackbarProvider
                    maxSnack={3}
                    preventDuplicate
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transitionDuration={{ appear: 200, enter: 100, exit: 200 }}
                    autoHideDuration={2000}
                >
                    <Base />
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
