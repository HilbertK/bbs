import React, { CSSProperties, FC, useEffect } from 'react';
import { IFrameComp } from '../../components/IFrame';
import { useSearchParams } from 'react-router-dom';
import { Empty } from 'antd';
import { baseUrl, subPathDict, subPathKey, SubPathValue } from './constants';
import { actions, getSubMenuByTopMenu } from '../../store/menu-slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

export const Sub: FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [searchParams] = useSearchParams();
    const pathValue = searchParams.get(subPathKey) as SubPathValue;
    const path = pathValue != null ? subPathDict[pathValue] : null;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.setCurrSubMenu(getSubMenuByTopMenu(pathValue)));
        dispatch(actions.setTopSubMenu(pathValue));
    }, [pathValue]);
    if (path == null || !userInfo) return <Empty style={{ ...ContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} description={false} />;
    return <IFrameComp loadUrl={`${baseUrl}${path}`} style={ContainerStyle} />;
};

const ContainerStyle: CSSProperties = {position: 'relative', flex: 1};