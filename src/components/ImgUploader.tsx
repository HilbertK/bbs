import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useMemo, useState } from 'react';
import { Font } from '../base/style';
import { useUpload } from '../hooks/useUpload';
import { ContentCenterStyle } from '../ui/base-utils';

export const ImgUploader: React.FC<{
    defaultValue?: string,
    label: string,
    onUploaded?: (url: string) => Promise<void> | void,
    maxSize?: number,
    aspect?: number
}> = props => {
    const { defaultValue, label, onUploaded, maxSize = 1, aspect = 1 } = props;
    const [imageUrl, setImageUrl] = useState<string>(defaultValue ?? '');
    const [loading, setLoading] = useState<boolean>(false);
    const onUploadedHander = async (url: string) => {
        await onUploaded?.(url);
        setLoading(true);
        setImageUrl(url);
    };
    const {
        uploading,
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded: onUploadedHander,
        maxSize,
    });

    const uploadText = useMemo(() => {
        if (uploading) return `${label}上传中...`;
        if (loading) return `${label}加载中...`;
        return `${imageUrl ? '修改' : '上传'}${label}`;
    }, [uploading, label, imageUrl, loading]);

    const stopLoading = () => setLoading(false);

    return (
        <ImgCrop rotate aspect={aspect}>
            <Upload
                beforeUpload={beforeUpload}
                method='PUT'
                maxCount={1}
                customRequest={onCustomRequest}
                action={getUploadUrl}
                listType='picture-card'
                onChange={onChange}
                showUploadList={false}
            >
                <Box sx={ContentStyle}>
                    <Box sx={ButtonStyle}>
                        {loading || uploading ? <LoadingOutlined /> : <UploadOutlined />}
                        <Box sx={ButtonTextStyle}>{uploadText}</Box>
                    </Box>
                    {imageUrl &&
                        <Box
                            onLoad={stopLoading}
                            onError={stopLoading}
                            sx={ImgStyle}
                            component='img'
                            src={imageUrl}
                        />
                    }
                </Box>
            </Upload>
        </ImgCrop>
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