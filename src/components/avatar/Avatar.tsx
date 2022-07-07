import styled from '@emotion/styled';
import { DefaultAvatar } from './DefaultAvatar';
import React, { useCallback, useState } from 'react';

interface IAvatar {
    url: string,
    name: string,
    avatarColor?: string,
}

export const Avatar: React.FunctionComponent<IAvatar> = React.memo(
    ({ url, name, avatarColor = '' }) => {
        const [error, setError] = useState<boolean>(false);
        const onImgError = useCallback(() => {
            setError(true);
        }, []);
        return (
            <AvatarWrapper>
                {url && !error && <AvatarImg src={url} onError={onImgError} />}
                <DefaultAvatar name={name} avatarColor={avatarColor} />
            </AvatarWrapper>
        );
    }
);
const AvatarWrapper = styled.div`
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    overflow: hidden;
    flex-shrink: 0;
`;

const AvatarImg = styled.img`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    border-radius: 16px;
`;
