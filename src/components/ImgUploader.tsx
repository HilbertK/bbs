import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import React, { useRef, useState } from 'react';
import { Font } from '../base/style';
import { useMessage } from '../hooks/useMessage';
import { getUploadAuth, uploadFileWithPut } from '../service/api';
import { ContentCenterStyle } from '../ui/base-utils';

const { notification } = useMessage();
export const ImgUploader: React.FC<{
    maxCount: number,
    defaultValue?: string,
    label: string,
    onUploaded?: (url: string) => Promise<void>,
}> = props => {
    const { maxCount, defaultValue, label, onUploaded } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const uploadFileName = useRef<string>('');
    const [imageUrl, setImageUrl] = useState<string>(defaultValue ?? '');

    const onChange: UploadProps['onChange'] = async info => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            try {
                await onUploaded?.(uploadFileName.current);
                notification.success({message: '上传成功'});
                setLoading(true);
                setImageUrl(uploadFileName.current);
            } catch (e) {
                console.error(e);
                notification.error({message: '上传失败'});
            } finally {
                setUploading(false);
            }
            return;
        }
        if (info.file.status === 'error') {
            setUploading(false);
            notification.error({message: '上传失败'});
        }
    };

    const stopLoading = () => setLoading(false);

    const beforeUpload = (file: RcFile) => {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
            notification.error({message: '文件大小不能超过20MB'});
            return false;
        }
        return true;
    };

    const getUploadUrl = async (file: RcFile) => {
        let newUploadUrl = '';
        try {
            const authResult = await getUploadAuth({fileName: file.name});
            newUploadUrl = authResult.signedUrl;
            uploadFileName.current = authResult.url;
        } catch (e) {
            console.error(e);
            newUploadUrl = '';
        }
        return newUploadUrl;
    };

    const onCustomRequest: UploadProps['customRequest'] = async ({
        file,
        action,
        onProgress,
        onSuccess,
        onError,
    }) => {
        onProgress?.({ percent: 0 });
        try {
            const res = await uploadFileWithPut({ file, url: action });
            onProgress?.({ percent: 100 });
            onSuccess?.(res);
        } catch (e: any) {
            onError?.(e);
        }
    };

    const getUploadText = () => {
        if (uploading) return `${label}上传中...`;
        if (loading) return `${label}加载中...`;
        return `${imageUrl ? '修改' : '上传'}${label}`
    };

    return (
        <ImgCrop rotate>
            <Upload
                beforeUpload={beforeUpload}
                method='PUT'
                maxCount={maxCount}
                customRequest={onCustomRequest}
                action={getUploadUrl}
                listType="picture-card"
                onChange={onChange}
                showUploadList={false}
            >
                <Box sx={ContentStyle}>
                    <Box sx={ButtonStyle}>
                        {loading ? <LoadingOutlined /> : <UploadOutlined />}
                        <Box sx={ButtonTextStyle}>{getUploadText()}</Box>
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
    background: 'rgba(0,0,0,0.6)',
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