import React, { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import { Palette } from '../../base/style';

interface IDefaultAvatar {
    name: string,
    size?: number,
    avatarColor?: string,
    isRound?: boolean,
}

export const defaultAvatarSize = 32;

export const DefaultAvatar: FC<IDefaultAvatar> = ({ name, size = defaultAvatarSize, avatarColor = '', isRound = true }) => {
    const content = useMemo(() => getAvatarName(name), [name]);
    return <AvatarWrap avatarColor={avatarColor} size={size} isRound={isRound}>{content}</AvatarWrap>;
};

export const getAvatarName = (name: string) => {
    // 目前name属性包涵昵称和名字 如得音(王乙雯)，截取的时候 先剔除掉name中的括号
    const userName = name.replace(/[()]/g, '');
    if (/[\u4e00-\u9fa5]/.test(userName)) {
        return userName.slice(-2);
    }
    return userName.slice(0, 1);
};

const AvatarWrap = styled.div<{
    avatarColor: string,
    size: number,
    isRound: boolean,
}>`
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: ${({ size, isRound }) => isRound ? `${size / 2}px` : 'unset'};
    line-height: ${props => props.size}px;
    background: ${props => (props.avatarColor ? props.avatarColor : Palette.Brand.Normal)};
    text-align: center;
    font-size: ${props => props.size - 20}px;
    color: #fff;
    flex-shrink: 0;
`;
