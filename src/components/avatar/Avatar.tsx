import styled from '@emotion/styled';
import { DefaultAvatar, defaultAvatarSize } from './DefaultAvatar';
import React, { useCallback, useState } from 'react';

interface IAvatar {
    url: string,
    name: string,
    size?: number,
    avatarColor?: string,
    isRound?: boolean,
}

export const Avatar: React.FC<IAvatar> = ({
    url,
    name,
    size = defaultAvatarSize,
    avatarColor = '',
    isRound = true
}) => {
    const [error, setError] = useState<boolean>(false);
    const onImgError = useCallback(() => {
        setError(true);
    }, []);
    return (
        <AvatarWrapper size={size} isRound={isRound}>
            {
                (url && !error) ?
                <AvatarImg size={size} isRound={isRound} src={url} onError={onImgError} /> :
                <DefaultAvatar name={name} avatarColor={avatarColor} size={size} isRound={isRound} />
            }
        </AvatarWrapper>
    );
};
const AvatarWrapper = styled.div<{
    size: number,
    isRound: boolean,
}>`
    position: relative;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: ${({ size, isRound }) => isRound ? `${size / 2}px` : 'unset'};
    overflow: hidden;
    flex-shrink: 0;
`;

const AvatarImg = styled.img<{
    size: number,
    isRound: boolean,
}>`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: ${({ size, isRound }) => isRound ? `${size / 2}px` : 'unset'};
`;
