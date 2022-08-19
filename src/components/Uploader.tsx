import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import { useMessage } from '../hooks/useMessage';

const { notification } = useMessage();
export const Uploader: React.FC<{
    maxCount: number,
}> = props => {
    const { maxCount } = props;
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onChange: UploadProps['onChange'] = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            // return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
        }
        setFileList(info.fileList);
    };

    const beforeUpload = (file: RcFile) => {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
            notification.error({message: '文件大小不能超过20MB'});
        }
        return isLt2M;
    };

    return (
        <ImgCrop rotate>
            <Upload
                beforeUpload={beforeUpload}
                maxCount={maxCount}
                action="/api/v1/buckets/test/objects/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                showUploadList={false}
            >
                <Box sx={ContentStyle}>
                    <Box sx={ButtonStyle}>
                        {loading ? <LoadingOutlined /> : <UploadOutlined />}
                    </Box>
                    {imageUrl && <Box component='img' src={imageUrl}></Box>}
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
    background: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};