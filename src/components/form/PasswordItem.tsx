import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import _debounce from 'lodash-es/debounce';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputTextStyle } from '../login/constants';

type InputItemValue = string | number | null;

const getPasswordItemId = (id: string) => `form-item-password_${id}`;

export const PasswordItem: FC<{
    id: string,
    label: string,
    error: string,
    value: InputItemValue,
    onChange: (value: InputItemValue) => void,
}> = ({ label, error, value, onChange, id }) => {
    const [showPassword, toggleShowPassword] = useState<boolean>(false);
    const onChangeWithDebounce: ChangeEventHandler<HTMLInputElement> = useCallback(_debounce(e => {
        const newValue = e.target.value;
        onChange(newValue === '' ? null : newValue);
    }, 500), [onChange]);
    const handleClickShowPassword = () => toggleShowPassword(prev => !prev);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <FormControl sx={InputTextStyle} variant="standard">
            <InputLabel htmlFor={getPasswordItemId(id)}>{label}</InputLabel>
            <Input
                id={getPasswordItemId(id)}
                maxRows={1}
                type={showPassword ? 'text' : 'password'}
                error={Boolean(error)}
                defaultValue={value ?? ''}
                onChange={onChangeWithDebounce}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {!!error && <Box sx={{ color: '#E95454' }}>{error}</Box>}
        </FormControl>
    );
};