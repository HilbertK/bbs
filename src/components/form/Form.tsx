import { Button, TextFieldProps } from '@mui/material';
import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { FC, useState } from 'react';
import { SubmitButtonStyle } from '../login/constants';
import { FormItemType } from './constants';
import { DateItemValue, DatePickerItem } from './DatePicker';
import { InputItem } from './InputItem';
import { PasswordItem } from './PasswordItem';
import { IRadioItem, RadioItem } from './RadioItem';
interface BaseFormItem {
    id: string,
    label: string,
    type: FormItemType,
    linkId?: string,
    validator?: (value: any) => Promise<string>,
    required: boolean,
    default?: FromValueContent,
}

type IFormInputItem = BaseFormItem & {
    type: FormItemType.Text | FormItemType.Password | FormItemType.Num,
    maxLength: number,
    variant?: TextFieldProps['variant'],
};

type IFormRadioItem = BaseFormItem & {
    type: FormItemType.Radio,
    radioList: Array<IRadioItem>,
};

export type IFormItem = IFormInputItem | IFormRadioItem | BaseFormItem;

export type FromValueContent = string | number | null;

interface IFormValue {
    error: string,
    value: FromValueContent,
}

export const Form: FC<{
    items: IFormItem[],
    submittext: string,
    onFinish: (result: Record<string, any>) => Promise<void>,
    onItemChange?: (id: string, value: FromValueContent) => void,
}> = props => {
    const { items, submittext, onFinish, onItemChange } = props;
    const [result, setResult] = useState<Record<string, IFormValue>>(() => {
        const newResult = items.reduce((prev, curr) => {
            const defaultValue = curr.default;
            return defaultValue ? {
                ...prev,
                [curr.id]: {
                    error: '',
                    value: defaultValue
                }
            } : prev;
        }, {});
        return newResult;
    });
    const onSubmit = async () => {
        let newResult: Record<string, IFormValue> = {};
        items.forEach(({ required, id, label }) => {
            if (
                required &&
                result[id] == null ||
                (result[id] != null &&
                    (result[id].value == null ||
                        result[id].value === ''))
            ) {
                newResult[id] = {
                    value: result[id] != null ? result[id].value : null,
                    error: `请输入${label}`
                };
            }
        });
        // 存在error
        if (Object.values(newResult).filter(rValue => rValue.error).length) {
            setResult(prevResult => ({ ...prevResult, ...newResult }));
            return;
        }
        await onFinish(Object.keys(result).reduce((prev, curr) => {
            const newValue = result[curr].value;
            const formItem = items.find(item => item.id === curr);
            if (formItem?.linkId) return prev;
            if (newValue == null) return prev;
            return {
                ...prev,
                [curr]: result[curr].value
            };
        }, {}));
    };
    const setItemValue = (id: string) => async (value: FromValueContent) => {
        let newFormValue = {
            value,
            error: '',
        };
        const currItem = items.find(item => item.id === id);
        if (currItem === undefined) return;
        if (currItem.required && (newFormValue.value == null || newFormValue.value === '')) {
            newFormValue.error = `请输入${currItem.label}`;
        } else if (currItem.linkId && newFormValue.value !== result[currItem.linkId]?.value) {
            const linkItem = items.find(item => item.id === currItem.linkId)!;
            newFormValue.error = `两次输入${linkItem.label}不一致`;
        } else if (
            validInputText(newFormValue.value)
            && (currItem as IFormInputItem).maxLength
            && newFormValue.value.length > (currItem as IFormInputItem).maxLength
        ) {
            newFormValue.value = newFormValue.value.slice(0, (currItem as IFormInputItem).maxLength);
        } else if (currItem.validator) {
            const errorText = await currItem.validator(newFormValue.value);
            newFormValue.error = errorText;
        }
        onItemChange?.(id, newFormValue.value);
        setResult(prevResult => ({ ...prevResult, [id]: newFormValue }));
    };
    const getError = (fieldItem: IFormValue | undefined) => fieldItem !== undefined ? fieldItem.error : '';
    const getValue = (fieldItem: IFormValue | undefined) => fieldItem !== undefined ? fieldItem.value : null;

    const renderComp = ({ label, type, id, ...extraItem }: IFormItem) => ({
        [FormItemType.Text]: <InputItem
            label={label}
            type={type}
            error={getError(result[id])}
            value={getValue(result[id])}
            onChange={setItemValue(id)}
            variant={(extraItem as IFormInputItem).variant}
        />,
        [FormItemType.Num]: <InputItem
            label={label}
            type={type}
            error={getError(result[id])}
            value={getValue(result[id])}
            onChange={setItemValue(id)}
            variant={(extraItem as IFormInputItem).variant}
        />,
        [FormItemType.Password]: <PasswordItem
            id={id}
            label={label}
            error={getError(result[id])}
            value={getValue(result[id])}
            onChange={setItemValue(id)}
        />,
        [FormItemType.Radio]: <RadioItem
            value={getValue(result[id])}
            radioList={(extraItem as IFormRadioItem).radioList}
            onChange={setItemValue(id)}
        />,
        [FormItemType.Date]: <DatePickerItem
            value={getValue(result[id]) as DateItemValue}
            onChange={setItemValue(id)}
            label={label}
        />
    }[type]);
    return (
        <Box>
            {items.map(item => <Box key={item.id}>{renderComp(item)}</Box>)}
            <Button
                variant='contained'
                onClick={onSubmit}
                sx={SubmitButtonStyle}
            >{submittext}</Button>
        </Box>
    );
};

export function validInputText(text: unknown): text is string {
    return text != null && typeof text === 'string';
}