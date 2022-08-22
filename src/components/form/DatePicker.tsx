import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import zhLocale from 'date-fns/locale/zh-CN';
import TextField from '@mui/material/TextField';
import { FC, useCallback, useState } from 'react';
import moment from 'moment';
import { dateFormat } from '../../service/constants';
import { SxProps, Theme } from '@mui/material';

export type DateItemValue = string | null;

export const DatePickerItem: FC<{
    label: string,
    value: string | null,
    onChange: (value: string) => void,
    sx?: SxProps<Theme>,
}> = ({ value, onChange, label, sx = {} }) => {
    const [content, setContent] = useState<Date | null>(value == null ? new Date() : new Date(value));
    const onChangeHandler = useCallback((newValue: Date | null) => {
        setContent(newValue);
        onChange(moment(newValue).format(dateFormat));
    }, [onChange]);
    const onBlurHandler = useCallback(() => {
        if (moment(content).isValid()) return;
        onChangeHandler(new Date());
    }, [onChangeHandler]);
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={zhLocale}
        >
            <DesktopDatePicker
                inputFormat='yyyy-MM-dd'
                label={label}
                value={content}
                onChange={onChangeHandler}
                renderInput={params => <TextField onBlur={onBlurHandler} sx={sx} {...params} />}
            />
        </LocalizationProvider>
    );
};