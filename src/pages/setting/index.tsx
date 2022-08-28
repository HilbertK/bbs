import { Box, Button, SxProps, Theme as SxTheme } from '@mui/material';
import { Dispatch } from '@reduxjs/toolkit';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Font, Palette, RoundCorner, Shadow } from '../../base/style';
import { DatePickerItem } from '../../components/form/DatePicker';
import { InputItem } from '../../components/form/InputItem';
import { RadioItem } from '../../components/form/RadioItem';
import { ImgUploader } from '../../components/ImgUploader';
import { checkPhone } from '../../service/api-utils';
import { IUserInfo } from '../../service/interface';
import { RootState } from '../../store';
import { updateUserInfoAction } from '../../store/user-slice';
import { appearanceAspect, BaseButtonStyle, contentMinHeight, contentWidth, GrayOutlineButtonStyle } from '../../ui/base-utils';
import { SexDict, SexEnum } from '../../utils/constants';
import { AvatarContainerStyle } from '../mine';
import { mineCenterAvatarSize, mineCenterContentTop } from '../mine/constants';

interface InfoItem {
    label?: string,
    key: string,
    content: string,
    style: SxProps<SxTheme>,
    validator?: (value: any) => Promise<string>,
    renderViewer?: (value: any) => JSX.Element | string,
    renderEditor?: (
        value: any,
        onChange: (value: any) => void | Promise<void>,
        error: string
    ) => JSX.Element,
}

const appearanceWidth = 200;

export const Setting: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch: Dispatch<any> = useDispatch();
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [itemValue, setItemValue] = useState<string>('');
    const [itemError, setItemError] = useState<string>('');
    if (userInfo == null) return null;
    const infoList: Array<InfoItem> = useMemo(() => [{
        content: userInfo.username,
        key: 'username',
        style: NameStyle
    }, {
        label: '真实名称',
        key: 'realname',
        content: userInfo.realname ?? '',
        style: TextStyle,
        renderEditor:
            (value, onChange, error) =>
                <InputItem
                    label='真实名称'
                    sx={TextInputStyle}
                    error={error}
                    value={value}
                    variant='outlined'
                    onChange={onChange}
                />
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
                    sx={{
                        ...TextInputStyle,
                        paddingBottom: '20px'
                    }}
                    value={value}
                    onChange={onChange}
                />
    }, {
        label: '性别',
        key: 'sex',
        content: userInfo.sex?.toString() ?? '',
        renderViewer: (value: any) => SexDict[value as SexEnum] ?? '',
        style: TextStyle,
        renderEditor:
            (value, onChange) =>
                <RadioItem
                    sx={{
                        ...TextInputStyle,
                        paddingBottom: '20px'
                    }}
                    radioList={[
                        { value: SexEnum.male, label: SexDict[SexEnum.male] },
                        { value: SexEnum.female, label: SexDict[SexEnum.female] },
                    ]}
                    value={value}
                    onChange={onChange}
                />
    }, {
        label: '个人简介',
        key: 'description',
        content: userInfo.description ?? '',
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
    }, {
        label: '形象照',
        key: 'appearance',
        content: userInfo.appearance ?? '',
        style: DescStyle,
        renderViewer: (value: any) => (
            <Box sx={{
                '& .ant-upload': {
                    width: `${appearanceWidth}px`,
                    height: `${appearanceWidth * appearanceAspect}px`
                }
            }}>
                <ImgUploader
                    defaultValue={value}
                    label='形象照'
                    onUploaded={(url: string) => {
                        dispatch(updateUserInfoAction({ id: userInfo.id, appearance: url}));
                    }}
                    maxSize={5}
                    aspect={appearanceAspect}
                />
            </Box>
        )
    }], [userInfo]);
    const onEditClick = (index: number, content: string) => () => {
        setEditIndex(index);
        setItemValue(content);
    };
    const onItemValueChange = (validator: InfoItem['validator'], key: string) => async (value: any) => {
        if (validator && value !== userInfo[key as keyof IUserInfo]) {
            const errorText = await validator(value);
            setItemError(errorText);
        } else {
            setItemError('');
        }
        setItemValue(value);
    };
    const onConfirmEdit = (key: string) => () => {
        if (itemError) return;
        dispatch(updateUserInfoAction({
            id: userInfo.id,
            [key]: itemValue,
            onSuccess: () => {
                setItemValue('');
                onCancelEdit();
            }
        }));
    };
    const onCancelEdit = () => {
        setEditIndex(null);
        setItemError('');
        setItemValue('');
    };
    const onUploaded = (url: string) => {
        dispatch(updateUserInfoAction({ id: userInfo.id, avatar: url}));
    };
    return (
        <Box sx={ContainerStyle}>
            <Box sx={ContentStyle}>
                <Box sx={InfoContainer}>
                    <Box sx={AvatarContainer}>
                        <ImgUploader
                            defaultValue={userInfo.avatar}
                            label='头像'
                            onUploaded={onUploaded}
                        />
                    </Box>
                    <Box sx={InfoContentStyle}>
                        {infoList.map(({
                            style,
                            content,
                            renderEditor,
                            label,
                            validator,
                            key,
                            renderViewer = (value: any) => value,
                        }, index) => (
                            <Box key={key} sx={InfoItemStyle}>
                                {editIndex !== index || !renderEditor ? (
                                    <>
                                        {label && <Box sx={{
                                            ...style,
                                            ...LabelStyle,
                                        }}>{label}</Box>}
                                        <Box sx={style}>{renderViewer(content)}</Box>
                                        {renderEditor && <Box
                                            className={editButtonClassName}
                                            onClick={onEditClick(index, content)}
                                        >修改</Box>}
                                    </>
                                ) : (
                                    <Box sx={EditorStyle}>
                                        {renderEditor(itemValue, onItemValueChange(validator, key), itemError)}
                                        <Box sx={ButtonGroupStyle}>
                                            <Button
                                                variant='contained'
                                                sx={BaseButtonStyle}
                                                disabled={itemError !== ''}
                                                onClick={onConfirmEdit(key)}
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
    minHeight: contentMinHeight,
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

const ButtonGroupStyle = {};

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