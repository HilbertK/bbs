import React from 'react';
import { ThemeProvider } from '@mui/material';
import { Theme } from './ui/mui-utils';
import { Provider } from 'react-redux';
import { store } from './store';
import 'moment/locale/zh-cn';
import Base from './Base';
import { ConfigProvider } from 'antd';
import { antdColor } from './ui/base-utils';
import zhCN from 'antd/es/locale/zh_CN';

function App() {
    ConfigProvider.config({
        theme: antdColor
    });
    return (
        <Provider store={store}>
            <ThemeProvider theme={Theme}>
                <ConfigProvider locale={zhCN}>
                    <Base />
                </ConfigProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
