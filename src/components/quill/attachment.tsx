import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Quill } from 'react-quill';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Border, Font, Palette, RoundCorner } from '../../base/style';
import { ContentCenterStyle, SingleText } from '../../ui/base-utils';
import { getSizeString } from '../../utils/util';
import { LoadingOutlined } from '@ant-design/icons';
import { downloadFile } from '../../service/api';
import { Progress } from 'antd';

interface IEditorLoadingOption {
    name: string,
    size: number,
    url: string,
}

const BlockEmbed = Quill.import('blots/block/embed');
export const attachmentBlotClassName = 'ql-attachment';
export const attachmentDownloadClassName = 'ql-attachment-download';
export const attachmentLoadingClassName = 'ql-attachment-loading';

const AttachmentComp: FC<IEditorLoadingOption> = ({ url, name, size }) => {
    const [percent, setPercent] = useState<number | null>(null);
    const onDownload = () =>
        downloadFile(
            url,
            (event) => {
                setPercent(Math.round(event.loaded / event.total * 100));
            },
            () => {
                setPercent(null);
            },
            name
        );
    return (
        <Box sx={AttachmentContainerStyle}>
            <Box sx={AttachmentContentStyle}>
                <InsertDriveFileIcon sx={FileIconStyle} />
                <Box sx={AttachmentInfoStyle}>
                    <Box sx={AttachmentNameStyle}>{name}</Box>
                    <Box sx={AttachmentSizeStyle}>{getSizeString(size)}</Box>
                </Box>
            </Box>
            <Box sx={AttachmentOpStyle}>
                {percent == null ?
                    <FileDownloadIcon className={attachmentDownloadClassName} sx={DownloadIconStyle} onClick={onDownload} />
                    :
                    <Progress type='circle' percent={percent} width={30} />
                }
                <LoadingOutlined className={attachmentLoadingClassName} style={{ display: 'none', fontSize: '30px' }} />
            </Box>
        </Box>
    );
};

export class AttachmentBlot extends BlockEmbed {
    static create(options: IEditorLoadingOption) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('oncontextmenu', 'return false');
        node.setAttribute('data-url', options.url);
        node.setAttribute('data-name', options.name);
        node.setAttribute('data-size', options.size);
        const container = createRoot(node);
        container.render(<AttachmentComp url={options.url} name={options.name} size={options.size} />);
        return node;
    }

    static value(node: any) {
        return {
            url: node.getAttribute('data-url'),
            name: node.getAttribute('data-name'),
            size: node.getAttribute('data-size'),
        };
    }
}
// blotName
AttachmentBlot.blotName = 'attachment';
// class名将用于匹配blot名称
AttachmentBlot.className = attachmentBlotClassName;
// 标签类型自定义
AttachmentBlot.tagName = 'div';

const AttachmentContainerStyle = {
    position: 'relative',
    cursor: 'default',
    width: '280px',
    height: '64px',
    borderRadius: RoundCorner(1),
    background: '#fff',
    border: Border.GrayBG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
};

const AttachmentContentStyle = {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 100px)',
};

const AttachmentInfoStyle = {
    marginLeft: '15px',
    marginRight: '15px',
    width: '100%',
    ...Font.AiderMedium,
    userSelect: 'text',
    textAlign: 'left !important'
};

const AttachmentNameStyle = {
    ...SingleText,
    color: Palette.Text.Text,
};

const AttachmentSizeStyle = {
    color: Palette.Text.Asider,
};

const FileIconStyle = {
    fontSize: '30px',
    color: Palette.Base.Clicked
};

const DownloadIconStyle = {
    fontSize: '30px',
    cursor: 'pointer'
};

const AttachmentOpStyle = {
    width: '30px',
    height: '30px',
    ...ContentCenterStyle
};