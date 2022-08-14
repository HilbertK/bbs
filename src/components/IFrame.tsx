import * as React from 'react';
import styled from '@emotion/styled';
import qs from 'qs';

interface IFrameProps {
    loadUrl: string,
    onLoad?: () => void,
    style?: React.CSSProperties,
}

const timeStamp = new Date().getTime();

export const IFrameComp = React.forwardRef((props: IFrameProps, ref) => {
    const iframeRef = React.useRef(null);

    const query = {
        'disable-cache-tag': timeStamp,
    };

    React.useImperativeHandle(
        ref,
        () => iframeRef,
        []
    );

    const onIFrameLoad = () => {
        props.onLoad?.();
    };

    return (
        <InnerIFrame
            id="doc-iframe"
            src={`${props.loadUrl}?${qs.stringify(query)}`}
            name={`${timeStamp}`}
            onLoad={onIFrameLoad}
            ref={iframeRef}
            style={props.style}
            allow="clipboard-read; clipboard-write;fullscreen"
        />
    );
});

const InnerIFrame = styled.iframe`
    border: none;
`;
