import { Modal } from 'antd';
import type {  UploadFileStatus } from 'antd/es/upload/interface';
import { EventEmitter } from 'eventemitter3';
import { FileUploader } from './FileUploader';

interface UploadFile {
    status: UploadFileStatus,
    url: string,
}

class UploadManager extends EventEmitter {
    private fileMap: Record<string, UploadFile> = {};
    private modalMap: Record<string, ReturnType<typeof Modal.confirm>> = {};
    constructor() {
        super();
    }

    public openUploadModal = (
        key: string,
        label: string,
        onUploaded: (url: string) => Promise<void> | void,
    ) => {
        if (this.modalMap[key]) {
            this.modalMap[key].destroy();
        }
        this.modalMap[key] = Modal.confirm({
            content: <FileUploader
                maxCount={1}
                label={label}
                onUploaded={async (url: string) => {
                    await onUploaded(url);
                    this.changeFileUrl(key, url);
                }}
                onFileChange={status => this.changeFileStatus(key, status)}
            />,
        });
    };

    public changeFileStatus = (key: string, status: UploadFileStatus, url?: string) => {
        this.fileMap[key] = {
            ...(this.fileMap[key] ?? {}),
            status
        };
    };

    public changeFileUrl = (key: string, url: string) => {
        this.fileMap[key] = {
            ...(this.fileMap[key] ?? {}),
            url
        };
    };

    public getFileStatus = (key: string) => this.fileMap[key].status;
}

export const uploadManager = new UploadManager();