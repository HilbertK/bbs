import { Dispatch } from '@reduxjs/toolkit';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseDomainUrl } from '../service/api';
import { thirdLoginAction } from '../store/user-slice';
import { defHttp } from '../utils/http';
import { useMessage } from './useMessage';

const { createMessage } = useMessage();

export const useThirdLogin = () => {
    const dispatch: Dispatch<any> = useDispatch();
    //第三方类型
    const thirdType = useRef<string>('');
    //第三方登录相关信息
    const [thirdLoginInfo, setThirdLoginInfo] = useState<any>({});
    //状态
    const thirdLoginState = useRef<boolean>(false);
    //提示窗
    const [thirdConfirmShow, setThirdConfirmShow] = useState<boolean>(false);
    //绑定密码弹窗
    const [thirdPasswordShow, setThirdPasswordShow] = useState<boolean>(false);
    //绑定密码
    const [thirdLoginPassword, setThirdLoginPassword] = useState<string>('');
    //加载中
    const [thirdCreateUserLoding, setThirdCreateUserLoding] = useState<boolean>(false);
    //第三方登录
    const onThirdLogin = (source: string) => {
        const url = `${baseDomainUrl}/sys/thirdLogin/render/${source}`;
        window.open(url, `login ${source}`, 'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
        thirdType.current = source;
        thirdLoginInfo.current = {};
        thirdLoginState.current = false;
        const receiveMessage = (event: any) => {
            const token = event.data;
            if (typeof token === 'string') {
                //如果是字符串类型 说明是token信息
                if (token === '登录失败') {
                    void createMessage.warning(token);
                } else if (token.includes('绑定手机号')) {
                    // do nothing
                } else {
                    doThirdLogin(token);
                }
            } else if (typeof token === 'object') {
                //对象类型 说明需要提示是否绑定现有账号
                if (token['isObj'] === true) {
                    setThirdConfirmShow(true);
                    setThirdLoginInfo({ ...token });
                }
            } else {
                void createMessage.warning('不识别的信息传递');
            }
        };
        window.addEventListener('message', receiveMessage, false);
    };
    // 根据token执行登录
    const doThirdLogin = (token: string) => {
        if (thirdLoginState.current === false) {
            thirdLoginState.current = true;
            dispatch(thirdLoginAction({ token, thirdType: thirdType.current }));
        }
    };
    // 绑定已有账号 需要输入密码
    const thirdLoginUserBind = () => {
        setThirdLoginPassword('');
        setThirdConfirmShow(false);
        setThirdPasswordShow(true);
    };
    //创建新账号
    const thirdLoginUserCreate = () => {
        setThirdCreateUserLoding(true);
        // 账号名后面添加两位随机数
        thirdLoginInfo.value.suffix = parseInt(`${Math.random() * 98 + 1}`, 10);
        defHttp
            .post({ url: '/sys/third/user/create', params: { thirdLoginInfo } }, { isTransformResponse: false })
            .then((res) => {
                if (res.success) {
                let token = res.result;
                doThirdLogin(token);
                setThirdConfirmShow(false);
                } else {
                    void createMessage.warning(res.message);
                }
            })
            .finally(() => {
                setThirdCreateUserLoding(false);
            });
    };
    // 核实密码
    const thirdLoginCheckPassword = async () => {
        const params = Object.assign({}, thirdLoginInfo, { password: thirdLoginPassword });
        await defHttp.post({ url: '/sys/third/user/checkPassword', params }, { isTransformResponse: false }).then((res) => {
            if (res.success) {
                thirdLoginNoPassword();
                doThirdLogin(res.result);
            } else {
                void createMessage.warning(res.message);
            }
        });
    };
    // 没有密码 取消操作
    const thirdLoginNoPassword = () => {
        setThirdPasswordShow(false);
        setThirdLoginPassword('');
    };
  //返回数据和方法
    return {
        thirdPasswordShow,
        thirdLoginCheckPassword,
        thirdLoginNoPassword,
        thirdLoginPassword,
        thirdConfirmShow,
        thirdCreateUserLoding,
        thirdLoginUserCreate,
        thirdLoginUserBind,
        onThirdLogin,
        setThirdLoginPassword,
    };
};
