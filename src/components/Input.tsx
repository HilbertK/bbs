import {TextField, SxProps, Theme} from '@mui/material';
import React, {useCallback, useEffect, useState} from 'react';
import _debounce from 'lodash-es/debounce';
import { TextFieldStyle } from '../ui/base-utils';

export const Input: React.FC<{
    maxRows: number,
    value: string,
    placeholder?: string,
    maxLength: number,
    onChange: (value: string) => void | Promise<void>,
    sx?: SxProps<Theme>,
    disabled?: boolean,
    minRows?: number,
    debounceTime?: number,
}> = props => {
    const {maxRows, value, placeholder = '', onChange, maxLength, sx = {}, disabled = false, minRows = 1, debounceTime = 0} = props;
    const [focus, setFocus] = useState<boolean>(false);
    const [content, setContent] = useState<string>(value);
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>('');
    const onChangeWithDebounce = useCallback(_debounce(async (newValue: string) => {
        try {
            await onChange(newValue);
        } catch(e) {
            setContent(value);
        }
    }, debounceTime), [onChange, value, debounceTime]);
    const onChangeHandler = useCallback(async (newValue: string) => {
        try {
            await onChange(newValue);
        } catch(e) {
            setContent(value);
        }
    }, [onChange, value]);
    const onTextChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setContent(newValue);
        if (newValue.length > maxLength) {
            setError(true);
            setHelperText(`最多输入${maxLength}个字符`);
        } else {
            setError(false);
            setHelperText('');
            const onChange = debounceTime === 0 ? onChangeHandler : onChangeWithDebounce;
            await onChange(newValue);
        }
    }, [onChangeWithDebounce, maxLength, debounceTime]);
    const onFocus = useCallback(() => {
        setFocus(true);
    }, []);
    const onBlur = useCallback(() => {
        setFocus(false);
    }, []);
    useEffect(() => {
        if (focus) return;
        setContent(value);
    }, [value, focus]);
    return (
        <TextField
            sx={{ ...TextFieldStyle, ...sx }}
            size='small'
            variant='outlined'
            onFocus={onFocus}
            onBlur={onBlur}
            value={content}
            error={error}
            maxRows={maxRows}
            multiline={maxRows > 1}
            helperText={helperText}
            placeholder={placeholder}
            onChange={onTextChange}
            disabled={disabled}
            minRows={minRows}
        />
    );
};