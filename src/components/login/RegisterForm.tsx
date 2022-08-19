import { FC, useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { register } from '../../service/api';
import { FormItemType } from '../form/constants';
import { Form, FromValueContent, IFormItem } from '../form/Form';
import { UserType } from './constants';
import { checkPhone, checkUsername } from '../../service/api-utils';

const userTypeId = 'usertype';

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
        id: userTypeId,
        label: '用户类型',
        required: true,
        type: FormItemType.Radio,
        default: UserType.NaturalPerson,
        radioList: [{
            value: UserType.NaturalPerson,
            label: '自然人'
        }, {
            value: UserType.LegalPerson,
            label: '法人'
        }]
    }
];

const NaturalPersonItems: Array<IFormItem> = [{
    id: 'realname',
    label: '自然人名称',
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
}];

const LegalPersonItems: Array<IFormItem> = [{
    id: 'realname',
    label: '法人名称',
    required: true,
    type: FormItemType.Text,
    maxLength: 20,
}];

export const RegisterForm: FC<{
    onRegister: () => void,
}> = props => {
    const { onRegister } = props;
    const [items, setItems] = useState<Array<IFormItem>>([...registerFormItems, ...NaturalPersonItems]);
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
    const onItemChange = (id: string, value: FromValueContent) => {
        if (id !== userTypeId) return;
        setItems([...registerFormItems, ...(value === UserType.NaturalPerson ? NaturalPersonItems : LegalPersonItems)]);
    };
    return <Form submittext='注册' items={items} onFinish={onFinish} onItemChange={onItemChange}/>;
};