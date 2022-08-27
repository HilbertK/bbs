import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import React, { useMemo, useState } from 'react';
import { Font } from '../base/style';
import { useUpload } from '../hooks/useUpload';
import { ContentCenterStyle } from '../ui/base-utils';

export const FileUploader: React.FC<{
    maxCount: number,
    defaultValue?: string,
    label: string,
    onUploaded?: (url: string) => Promise<void> | void,
}> = props => {
    const { maxCount, label, onUploaded } = props;
    const onUploadedHander = async (url: string) => {
        await onUploaded?.(url);
    };
    const {
        uploading,
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded: onUploadedHander,
        maxSize: 2000,
    });

    return (
        <Upload
            beforeUpload={beforeUpload}
            method='PUT'
            maxCount={maxCount}
            customRequest={onCustomRequest}
            action={getUploadUrl}
            onChange={onChange}
            showUploadList={maxCount > 1}
        >
            <Box sx={ContentStyle}>
                <Box sx={ButtonStyle}>
                    {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                </Box>
            </Box>
        </Upload>
    );
};

const ContentStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
};

const ButtonStyle = {
    ...ContentCenterStyle,
    fontSize: '30px',
    flexDirection: 'column',
    background: 'rgba(98, 110, 133, .5)',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    color: '#fff',
};

const ImgStyle = {
    width: '100%',
    height: '100%',
};

const ButtonTextStyle = {
    ...Font.TitleLargeBold,
    marginTop: '15px',
};