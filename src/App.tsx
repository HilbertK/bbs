import React from 'react';
import { ThemeProvider } from '@mui/material';
import { Theme } from './ui/mui-utils';
import { Provider } from 'react-redux';
import { store } from './store';
import 'moment/locale/zh-cn';
import Base from './Base';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={Theme}>
                <Base />
            </ThemeProvider>
        </Provider>
    );
}

export default App;
