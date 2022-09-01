import { Box } from '@mui/material';
import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useUpload } from '../../../hooks/useUpload';

export const ImgUploader = forwardRef((props: {
    onUploaded?: (url: string) => Promise<void> | void,
    onUrlFetched?: (url: string) => void,
    maxSize?: number,
}, ref) => {
    const { onUploaded, maxSize = 1, onUrlFetched } = props;
    const {
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded,
        onUrlFetched,
        maxSize,
        label: '图片'
    });
    return createPortal(
        <Box sx={ContentStyle} ref={ref}>
            <Upload
                beforeUpload={beforeUpload}
                method='PUT'
                customRequest={onCustomRequest}
                action={getUploadUrl}
                accept='.jpg,.jpeg,.png,.gif'
                onChange={onChange}
                showUploadList={false}
            />
        </Box>,
        document.body
    );
});

export const FileUploader = forwardRef((props: {
    onUploaded: (url: string) => Promise<void> | void,
    onUrlFetched?: (url: string, file: RcFile) => void,
    maxSize?: number,
    accept?: string,
    label?: string,
}, ref) => {
    const { onUploaded, maxSize = 1, accept, onUrlFetched, label } = props;
    const {
        onChange,
        getUploadUrl,
        onCustomRequest,
        beforeUpload,
    } = useUpload({
        onUploaded,
        onUrlFetched,
        maxSize,
        label
    });
    return createPortal(
        <Box sx={ContentStyle} ref={ref}>
            <Upload
                beforeUpload={beforeUpload}
                method='PUT'
                customRequest={onCustomRequest}
                action={getUploadUrl}
                accept={accept}
                onChange={onChange}
                showUploadList={false}
            />
        </Box>,
        document.body
    );
});

const ContentStyle = {
    display: 'none !important',
};