import React, { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import { Palette } from '../../base/style';

interface IDefaultAvatar {
    name: string,
    avatarColor?: string,
}

export const DefaultAvatar: FC<IDefaultAvatar> = ({ name, avatarColor = '' }) => {
    const content = useMemo(() => getAvatarName(name), [name]);
    return <AvatarWrap avatarColor={avatarColor}>{content}</AvatarWrap>;
};

export const getAvatarName = (name: string) => {
    // 目前name属性包涵昵称和名字 如得音(王乙雯)，截取的时候 先剔除掉name中的括号
    const userName = name.replace(/[()]/g, '');
    if (/[\u4e00-\u9fa5]/.test(userName)) {
        return userName.slice(-2);
    }
    return userName.slice(0, 1);
};

const AvatarWrap = styled.div<{avatarColor: string}>`
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 16px;
    background: ${props => (props.avatarColor ? props.avatarColor : Palette.Brand.Default)};
    text-align: center;
    font-size: 12px;
    color: #fff;
    flex-shrink: 0;
`;
