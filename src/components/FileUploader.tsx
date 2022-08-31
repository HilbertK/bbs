import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import type { UploadProps, UploadFileStatus } from 'antd/es/upload/interface';
import React, { useMemo, useState } from 'react';
import { Font } from '../base/style';
import { useUpload } from '../hooks/useUpload';

const { Dragger } = Upload;
export const FileUploader: React.FC<{
    maxCount: number,
    defaultValue?: string,
    label: string,
    onUploaded?: (url: string) => Promise<void> | void,
    onFileChange: (status: UploadFileStatus) => void,
    maxSize?: number,
}> = props => {
    const { maxCount, label, onUploaded, onFileChange, maxSize = 500 } = props;
    const {
        uploading,
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded,
        maxSize,
    });

    const onChangeHandler: UploadProps['onChange'] = info => {
        if (info.file.status) onFileChange(info.file.status);
        onChange(info);
    };

    return (
        <Dragger
            beforeUpload={beforeUpload}
            method='PUT'
            maxCount={maxCount}
            customRequest={onCustomRequest}
            action={getUploadUrl}
            onChange={onChangeHandler}
            showUploadList={maxCount > 1}
        >
            <Box sx={ContentStyle}>
                {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                <Box sx={ContentTextStyle}>点击或拖拽{label}至此处上传</Box>
            </Box>
        </Dragger>
    );
};

const ContentStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
};

const ContentTextStyle = {
    ...Font.TitleMediumBold,
    marginTop: '15px',
};