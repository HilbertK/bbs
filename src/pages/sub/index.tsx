import { CSSProperties, FC } from 'react';
import { IFrameComp } from '../../components/IFrame';
import { useSearchParams } from 'react-router-dom';
import { Empty } from 'antd';
import { baseUrl, subPathDict, subPathKey, SubPathValue } from './constants';
import { getSubMenuByTopMenu } from '../../store/menu-slice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useMenu } from '../hooks/useMenu';

export const Sub: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [searchParams] = useSearchParams();
    const pathValue = searchParams.get(subPathKey) as SubPathValue;
    const path = pathValue != null ? subPathDict[pathValue] : null;
    useMenu(getSubMenuByTopMenu(pathValue), pathValue);
    if (path == null || !userInfo) return <Empty style={{ ...ContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} description={false} />;
    return <IFrameComp loadUrl={`${baseUrl}${path}`} style={ContainerStyle} />;
};

const ContainerStyle: CSSProperties = {position: 'relative', flex: 1};