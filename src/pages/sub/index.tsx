import React, { CSSProperties, FC } from 'react';
import { IFrameComp } from '../../components/IFrame';
import { useSearchParams } from 'react-router-dom';
import { Empty } from 'antd';
import { baseUrl, subPathDict, subPathKey, SubPathValue } from './constants';

export const Sub: FC = () => {
    const [searchParams] = useSearchParams();
    const pathValue = searchParams.get(subPathKey);
    const path = pathValue != null ? subPathDict[pathValue as SubPathValue] : null;
    if (path == null) return <Empty style={{ ...ContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} description={false} />;
    return <IFrameComp loadUrl={`${baseUrl}${path}`} style={ContainerStyle} />;
};

const ContainerStyle: CSSProperties = {position: 'relative', flex: 1};