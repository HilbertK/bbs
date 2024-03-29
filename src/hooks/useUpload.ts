import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useRef, useState } from 'react';
import { useMessage } from './useMessage';
import { getUploadAuth, uploadFileWithPut } from '../service/api';
import { getSizeString } from '../utils/util';

interface IUploadProps {
    onUploaded?: (url: string) => Promise<void> | void,
    onUrlFetched?: (url: string, file: RcFile) => void,
    maxSize: number, // xxM,
    label?: string,
}

const { notification } = useMessage();
export const useUpload = ({
    onUploaded,
    onUrlFetched,
    maxSize,
    label = '文件',
}: IUploadProps) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const uploadFileName = useRef<string>('');

    const onChange: UploadProps['onChange'] = async info => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            try {
                await onUploaded?.(uploadFileName.current);
                notification.success({message: '上传成功'});
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

    const beforeUpload = (file: RcFile) => {
        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
            notification.error({message: `${label}大小不能超过${getSizeString(maxSize * 1024 * 1024)}`});
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
            onUrlFetched?.(authResult.url, file);
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
    return {
        uploading,
        onChange,
        beforeUpload,
        getUploadUrl,
        onCustomRequest,
    };
};