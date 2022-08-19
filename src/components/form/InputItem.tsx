import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEventHandler, FC, HTMLInputTypeAttribute, useCallback } from 'react';
import { InputTextStyle } from '../login/constants';
import _debounce from 'lodash-es/debounce';
import { SxProps, Theme } from '@mui/material';

type InputItemValue = string | number | null;

export const InputItem: FC<{
    type?: HTMLInputTypeAttribute,
    label: string,
    error: string,
    value: InputItemValue,
    onChange: (value: InputItemValue) => void,
    variant?: TextFieldProps['variant'],
    sx?: SxProps<Theme>,
    maxRows?: number,
    minRows?: number,
}> = ({ type = 'text', label, error, value, onChange, variant = 'standard', maxRows = 1, minRows = 1, sx = {} }) => {
    const onChangeWithDebounce: ChangeEventHandler<HTMLInputElement> = useCallback(_debounce(e => {
        const newValue = e.target.value;
        onChange(newValue === '' ? null : newValue);
    }, 500), [onChange]);
    return (
        <TextField
            maxRows={maxRows}
            minRows={minRows}
            multiline={minRows > 1}
            sx={{
                ...InputTextStyle,
                ...sx
            }}
            type={type}
            label={label}
            error={Boolean(error)}
            helperText={error}
            defaultValue={value ?? ''}
            variant={variant}
            onChange={onChangeWithDebounce}
        />
    );
};