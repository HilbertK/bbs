import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@mui/material';
import { Modal } from 'antd';
import { FC, useState } from 'react';
import { Shadow } from '../../base/style';
import { TabBaseStyle, TabsBaseStyle } from '../../ui/base-utils';
import { loginContentWidth, LoginDict, LoginMode } from './constants';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const tabList = [LoginDict[LoginMode.Login], LoginDict[LoginMode.Signup]];
export const Login: FC<{
    open: boolean,
    onClose: () => void,
}> = props => {
    const { open, onClose } = props;
    const [checkedTabs, setCheckedTabs] = useState<number>(0);
    const onTabClickHandler = (index: number) => () => {
        setCheckedTabs(index);
    };
    const onCloseHandler = () => {
        setCheckedTabs(0);
        onClose();
    };
    return (
        <AModal
            destroyOnClose
            maskClosable={false}
            visible={open}
            footer={null}
            centered
            onCancel={onCloseHandler}
            width={loginContentWidth}
        >
            <Box sx={Content}>
                <Tabs sx={TabsBaseStyle} value={checkedTabs}>
                    {tabList.map(({ title, key }, index) => (
                        <Tab
                            sx={TabBaseStyle}
                            key={key}
                            label={title}
                            onClick={onTabClickHandler(index)}
                        />
                    ))}
                </Tabs>
                {checkedTabs === 0 ? <LoginForm onLogin={onCloseHandler} /> : <RegisterForm onRegister={onCloseHandler} />}
            </Box>
        </AModal>
    );
};

const Content = {
    width: '100%',
    backgroundColor: '#fff',
};

const AModal = styled(Modal)`
    & .ant-modal-content {
        box-shadow: ${Shadow.Large};
        border-radius: 8px;
    }
    & .ant-modal-body {
        padding: 0 24px 24px;
    }
`;