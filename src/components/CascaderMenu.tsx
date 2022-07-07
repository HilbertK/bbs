import React, {FC} from 'react';
import { CategoryItem } from '../base/interface';
import { Cascader } from 'antd';

interface ICascader {
    options: CategoryItem[],
    onChange: (value: string[]) => void,
}

export const CascaderMenu: FC<ICascader> = props => {
    const { options, onChange } = props;
    const onChangeHandler = (value: (string | number)[]) => {
        onChange(value.map(item => item.toString()));
    };
    return <Cascader options={options} onChange={onChangeHandler} />;
};