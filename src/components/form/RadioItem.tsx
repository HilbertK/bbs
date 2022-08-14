import { FormControl, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { FC, useCallback } from 'react';
import { Font, Palette } from '../../base/style';

type RadioItemValue = string | number | null;

export interface IRadioItem {
    value: RadioItemValue,
    label: string,
}

interface IRadioItemProps {
    value: RadioItemValue,
    radioList: Array<IRadioItem>,
    onChange: (value: RadioItemValue) => void,
}

export const RadioItem: FC<IRadioItemProps> = ({
    value,
    radioList,
    onChange
}) => {
    const onRadioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    }, [onChange]);
    return (
        <FormControl sx={{width: '100%'}}>
            <RadioGroup
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
                onChange={onRadioChange}
                value={value}
            >
                {radioList.map(
                    ({ value: radioValue, label: radioLabel }) =>
                        <FormControlLabel
                            sx={{
                                '& span': {...Font.TextMedium, color: Palette.Text.Text}
                            }}
                            key={radioValue}
                            value={radioValue}
                            control={<Radio size='small' />}
                            label={radioLabel}
                        />
                )}
            </RadioGroup>
        </FormControl>
    );
};