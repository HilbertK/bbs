import { Box, TextField } from '@mui/material';
import { Button, Modal } from 'antd';
import { ChangeEventHandler, FC, useState } from 'react';
import { useThirdLogin } from '../../hooks/useThirdLogin';
import { InputTextStyle } from './constants';
import { Palette } from '../../base/style';
import { ContentCenterStyle } from '../../ui/base-utils';
import { QyWechatLogo } from './QyWechatLogo';

export const ThirdModal: FC = () => {
    const {
        thirdPasswordShow,
        thirdLoginCheckPassword,
        thirdLoginNoPassword,
        thirdLoginPassword,
        thirdConfirmShow,
        thirdLoginUserCreate,
        thirdCreateUserLoding,
        thirdLoginUserBind,
        setThirdLoginPassword,
        onThirdLogin,
        bindingPhoneModal,
        thirdHandlerOk,
        setThirdPhone,
        thirdPhone,
        checkPhone,
    } = useThirdLogin();
    const [phoneError, setPhoneError] = useState<string>('');
    const onPasswordChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        setThirdLoginPassword(newValue);
    };
    const onPhoneChange: ChangeEventHandler<HTMLInputElement> = event => {
        const newValue = event.target.value;
        setPhoneError(checkPhone(newValue));
        setThirdPhone(newValue);
    };
    const onQWThirdLogin = () => onThirdLogin('wechat_enterprise');
    return (
        <Box sx={ContentCenterStyle}>
            <Box
                component='a'
                onClick={onQWThirdLogin}
                title="企业微信"
                sx={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    background: Palette.Fill.Normal,
                    ...ContentCenterStyle,
                    '& *': {
                        fill: '#fff',
                        cursor: 'pointer',
                    },
                    '&:hover': {
                        background: Palette.Brand.Normal,
                    }
                }}
            >
                <QyWechatLogo />
            </Box>
            <Modal
                title="请输入密码"
                visible={thirdPasswordShow}
                onOk={thirdLoginCheckPassword}
                onCancel={thirdLoginNoPassword}
            >
                <TextField
                    maxRows={1}
                    sx={{
                        ...InputTextStyle,
                        width: '80%'
                    }}
                    type='password'
                    label='密码'
                    // error={passwordHelptext !== ''}
                    // helperText={passwordHelptext}
                    value={thirdLoginPassword}
                    variant='standard'
                    onChange={onPasswordChange}
                />
            </Modal>
            <Modal
                footer={null}
                closable={false}
                visible={thirdConfirmShow}
            >
                <Box className="ant-modal-confirm-body-wrapper">
                    <Box className="ant-modal-confirm-body">
                        <Box component='span' className="ant-modal-confirm-title">提示</Box>
                        <Box className="ant-modal-confirm-content">已有同名账号存在,请确认是否绑定该账号？</Box>
                    </Box>
                    <Box className="ant-modal-confirm-btns">
                        <Button onClick={thirdLoginUserCreate} loading={thirdCreateUserLoding}>创建新账号</Button>
                        <Button onClick={thirdLoginUserBind} type="primary">确认绑定</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                title="绑定手机号"
                footer={null}
                visible={bindingPhoneModal}
                maskClosable={false}
            >
                <TextField
                    size='medium'
                    placeholder="请输入手机号"
                    maxRows={1}
                    sx={{
                        ...InputTextStyle,
                        display: 'block',
                        width: '80%'
                    }}
                    error={Boolean(phoneError)}
                    helperText={phoneError}
                    type='text'
                    label='手机号'
                    value={thirdPhone}
                    variant='standard'
                    onChange={onPhoneChange}
                />
                <Button type="primary" onClick={thirdHandlerOk}>确定</Button>
            </Modal >
        </Box >
    );
};