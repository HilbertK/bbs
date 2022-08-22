import { FC } from 'react';
import _debounce from 'lodash-es/debounce';
import { register } from '../../service/api';
import { FormItemType } from '../form/constants';
import { Form, IFormItem } from '../form/Form';
import { checkPhone, checkUsername } from '../../service/api-utils';

const registerFormItems: Array<IFormItem> = [
    {
        id: 'username',
        label: '账号',
        validator: checkUsername,
        required: true,
        type: FormItemType.Text,
        maxLength: 20,
    }, {
        id: 'password',
        label: '密码',
        required: true,
        type: FormItemType.Password,
        maxLength: 50,
    }, {
        id: 'confirm_password',
        label: '确认密码',
        required: true,
        type: FormItemType.Password,
        linkId: 'password',
        maxLength: 50,
    }, {
        id: 'realname',
        label: '真实名称',
        required: true,
        type: FormItemType.Text,
        maxLength: 20,
    }, {
        id: 'phone',
        label: '手机号',
        validator: checkPhone,
        required: true,
        type: FormItemType.Text,
        maxLength: 11,
    }
];

export const RegisterForm: FC<{
    onRegister: () => void,
}> = props => {
    const { onRegister } = props;
    const onFinish = async (result: Record<string, string>) => {
        try {
            await register({
                username: result.username,
                password: result.password,
                usertype: result.usertype,
                realname: result.realname,
                phone: result.phone,
            });
            // onRegister();
        } catch (error) {
            console.error(error);
        }
    };
    return <Form submittext='注册' items={registerFormItems} onFinish={onFinish}/>;
};