import { checkOnlyUser } from './api';

export const checkUsername = async (value: string) => {
    try {
        const res = await checkOnlyUser({ username: value });
        return res.success ? '' : '账号已存在';
    } catch {
        return '账号输入有误';
    }
};

export const checkPhone = async (value: string) => {
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(value)) {
        return Promise.resolve('请输入正确手机号');
    } else {
        try {
            const res = await checkOnlyUser({ phone: value });
            return res.success ? '' : '手机号已存在';
        } catch {
            return '手机号输入有误';
        }
    }
};