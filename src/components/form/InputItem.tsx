import TextField from '@mui/material/TextField';
import React, { ChangeEventHandler, FC, HTMLInputTypeAttribute } from 'react';
import { InputTextStyle } from '../login/constants';

type InputItemValue = string | number | null;

export const InputItem: FC<{
    type: HTMLInputTypeAttribute,
    label: string,
    error: string,
    value: InputItemValue,
    onChange: (value: InputItemValue) => void,
}> = ({ type, label, error, value, onChange }) => {
    const changeHandler: ChangeEventHandler<HTMLInputElement> = e => {
        const newValue = e.target.value;
        onChange(newValue === '' ? null : newValue);
    };
    return (
        <TextField
            maxRows={1}
            sx={InputTextStyle}
            type={type}
            label={label}
            error={Boolean(error)}
            helperText={error}
            value={value ?? ''}
            variant='standard'
            onChange={changeHandler}
        />
    );
};