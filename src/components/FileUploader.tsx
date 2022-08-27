import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import type { UploadProps, UploadFileStatus } from 'antd/es/upload/interface';
import React, { useMemo, useState } from 'react';
import { Font } from '../base/style';
import { useUpload } from '../hooks/useUpload';
import { ContentCenterStyle } from '../ui/base-utils';

const { Dragger } = Upload;
export const FileUploader: React.FC<{
    maxCount: number,
    defaultValue?: string,
    label: string,
    onUploaded?: (url: string) => Promise<void> | void,
    onFileChange: (status: UploadFileStatus) => void,
}> = props => {
    const { maxCount, label, onUploaded, onFileChange } = props;
    const {
        uploading,
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded,
        maxSize: 2000,
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
                <Box sx={ButtonStyle}>
                    {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                </Box>
            </Box>
        </Dragger>
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