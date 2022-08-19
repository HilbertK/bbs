import { Box, Button, SxProps, Theme as SxTheme } from '@mui/material';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Font, Palette, RoundCorner, Shadow } from '../../base/style';
import { DatePickerItem } from '../../components/form/DatePicker';
import { InputItem } from '../../components/form/InputItem';
import { Uploader } from '../../components/Uploader';
import { checkPhone } from '../../service/api-utils';
import { RootState } from '../../store';
import { BaseButtonStyle, contentWidth, GrayOutlineButtonStyle } from '../../ui/base-utils';
import { AvatarContainerStyle } from '../mine';
import { mineCenterAvatarSize, mineCenterContentTop } from '../mine/constants';

interface InfoItem {
    label?: string,
    key?: string,
    content: string,
    style: SxProps<SxTheme>,
    validator?: (value: any) => Promise<string>,
    renderEditor?: (value: any, onChange: (value: any) => void, error: string) => JSX.Element
}

export const Setting: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [itemValue, setItemValue] = useState<string>('');
    const [itemError, setItemError] = useState<string>('');
    if (userInfo == null) return null;
    const infoList: Array<InfoItem> = [{
        content: userInfo.username,
        key: 'username',
        style: NameStyle
    }, {
        label: '手机号',
        key: 'phone',
        content: userInfo.phone ?? '',
        style: TextStyle,
        validator: checkPhone,
        renderEditor:
            (value, onChange, error) =>
                <InputItem
                    label='手机号'
                    sx={TextInputStyle}
                    error={error}
                    value={value}
                    variant='outlined'
                    onChange={onChange}
                />

    }, {
        label: '邮箱',
        key: 'email',
        content: userInfo.email ?? '',
        style: TextStyle,
        renderEditor:
            (value, onChange, error) =>
                <InputItem
                    label='邮箱'
                    sx={TextInputStyle}
                    error={error}
                    value={value}
                    variant='outlined'
                    onChange={onChange}
                />
    }, {
        label: '生日',
        key: 'birthday',
        content: userInfo.birthday ?? '',
        style: TextStyle,
        renderEditor:
            (value, onChange, error) =>
                <DatePickerItem
                    label='生日'
                    sx={TextInputStyle}
                    value={value}
                    onChange={onChange}
                />
    }, {
        label: '个人简介',
        key: 'desc',
        content: userInfo.desc ?? '',
        style: DescStyle,
        renderEditor:
            (value, onChange, error) =>
                <InputItem
                    label='个人简介'
                    sx={DescInputStyle}
                    maxRows={5}
                    minRows={5}
                    error={error}
                    value={value}
                    variant='outlined'
                    onChange={onChange}
                />
    }];
    const onEditClick = (index: number, content: string) => () => {
        setEditIndex(index);
        setItemValue(content);
    };
    const onConfirmEdit = (validator: InfoItem['validator'], key?: string) => async () => {
        if (!key) return;
        let errorText = '';
        if (validator) {
            errorText = await validator(itemValue);
        }
        if (errorText !== '') {
            setItemError(errorText);
            return;
        }
        setItemValue('');
    };
    const onCancelEdit = () => setEditIndex(null);
    return (
        <Box sx={ContainerStyle}>
            <Box sx={ContentStyle}>
                <Box sx={InfoContainer}>
                    <Box sx={AvatarContainer}>
                        <Uploader maxCount={1} />
                    </Box>
                    <Box sx={InfoContentStyle}>
                        {infoList.map(({ style, content, renderEditor, label, validator, key }, index) => (
                            <Box key={key} sx={InfoItemStyle}>
                                {editIndex !== index || !renderEditor ? (
                                    <>
                                        {label && <Box sx={{
                                            ...style,
                                            ...LabelStyle,
                                        }}>{label}</Box>}
                                        <Box sx={style}>{content}</Box>
                                        {renderEditor && <Box
                                            className={editButtonClassName}
                                            onClick={onEditClick(index, content)}
                                        >修改</Box>}
                                    </>
                                ) : (
                                    <Box sx={EditorStyle}>
                                        {renderEditor(itemValue, setItemValue, itemError)}
                                        <Box sx={ButtonGroupStyle}>
                                            <Button
                                                variant='contained'
                                                sx={BaseButtonStyle}
                                                onClick={onConfirmEdit(validator, key)}
                                            >保存</Button>
                                            <Button
                                                sx={{
                                                    ...GrayOutlineButtonStyle,
                                                    marginLeft: '10px',
                                                }}
                                                variant='outlined'
                                                onClick={onCancelEdit}
                                            >取消</Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const editButtonClassName = 'setting-edit-button';

const ContainerStyle = {
    minHeight: '100vh',
    padding: `${mineCenterContentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
};

const ContentStyle = {
    width: `${contentWidth}px`,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    boxShadow: Shadow.Light,
    borderRadius: RoundCorner(1),
};

const InfoContainer = {
    width: '100%',
    display: 'flex',
    padding: '0 20px 20px'
};

const AvatarContainer = {
    ...AvatarContainerStyle,
    '& .ant-upload.ant-upload-select-picture-card': {
        width: `${mineCenterAvatarSize}px`,
        height: `${mineCenterAvatarSize}px`,
        margin: 0,
        borderRadius: 'unset'
    },
};

const InfoContentStyle = {
    padding: '16px 32px 0',
};

const InfoItemStyle = {
    display: 'flex',
    alignItem: 'center',
    marginBottom: '10px',
    [`& .${editButtonClassName}`]: {
        display: 'none',
        color: Palette.Brand.Normal,
        cursor: 'pointer',
        marginLeft: '20px',
    },
    [`&:hover .${editButtonClassName}`]: {
        display: 'block',
    }
};

const EditorStyle = {
    marginTop: '10px',
    '& .MuiTextField-root': {
        paddingBottom: 0,
    },
};

const LabelStyle = {
    width: '100px',
    marginRight: '20px',
};

const NameStyle = {
    ...Font.TitleHugeBold2,
    color: Palette.Text.Title,
};

const DescStyle = {
    ...Font.TextMedium,
    color: Palette.Text.Text,
};

const TextStyle = {
    ...Font.TextMedium,
    color: Palette.Text.Text,
};

const ButtonGroupStyle = {
    marginTop: '20px',
};

const TextInputStyle = {
    '& .MuiInputBase-root' :TextStyle,
    '& .MuiInputLabel-root': {
        background: '#fff'
    },
};

const DescInputStyle = {
    '& .MuiInputBase-root' :DescStyle,
    '& .MuiInputLabel-root': {
        background: '#fff'
    },
};