import { forwardRef, MutableRefObject, useMemo, useRef } from 'react';
import './editor.scss';
import ReactDOMServer from 'react-dom/server';
import ReactQuill, { Quill } from 'react-quill';
import BlotFormatter from 'quill-blot-formatter';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import 'react-quill/dist/quill.snow.css';
import './quill-emoji.css';
import { Light } from '../../base/style';
import { FileUploader, ImgUploader } from './components/Uploader';
import { VideoBlot } from './video';
import { AttachmentBlot, attachmentBlotClassName, attachmentDownloadClassName, attachmentLoadingClassName } from './attachment';
import type { RcFile } from 'antd/es/upload/interface';
import { ImageBlot } from './image';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Emoji = require('quill-emoji/dist/quill-emoji');
const icons = Quill.import('ui/icons');
const qullSizes = Quill.import('formats/size');
const quillFont = Quill.import('formats/font');

const attachmentIcon = ReactDOMServer.renderToStaticMarkup(<UploadFileIcon />);
const sizes = ['12', false, '16', '18', '20', '22', '24', '26', '28', '30'];
const fonts = [false, 'SimSun', 'SimHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
icons['attachment'] = attachmentIcon;
qullSizes['whitelist'] = sizes;
quillFont['whitelist'] = fonts;
interface IEditor {
    onChange?: (value: string) => void,
    readOnly?: boolean,
    content?: string,
}

Quill.register({
    'modules/emoji': Emoji,
    'formats/video': VideoBlot,
    'formats/image': ImageBlot,
    'formats/attachment': AttachmentBlot,
    'modules/blotFormatter': BlotFormatter
}, true);
const LightColors = Object.values(Light).reduce((prev: string[], curr) => ([...prev, ...Object.values(curr).slice(-7)]), []);

const formats = [
    'font', 'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'code',
    'background', 'color',
    'list', 'bullet', 'indent', 'emoji',
    'link', 'image', 'video', 'attachment'
];

export const Editor = forwardRef<ReactQuill, IEditor>((props, ref) => {
    const { content, onChange = () => {}, readOnly } = props;
    const imgRef = useRef<HTMLElement | null>(null);
    const videoRef = useRef<HTMLElement | null>(null);
    const attachmentRef = useRef<HTMLElement | null>(null);

    const insertImage = (url: string) => {
        const quill = (ref as MutableRefObject<ReactQuill>)?.current?.getEditor();
        const currPos = quill.getSelection()?.index ?? 0;
        quill.insertEmbed(currPos, 'image', { url });
        quill.setSelection(currPos + 2, 0);
    };
    const insertVideo = (url: string) => {
        const quill = (ref as MutableRefObject<ReactQuill>)?.current?.getEditor();
        const currPos = quill.getSelection()?.index ?? 0;
        quill.insertEmbed(currPos, 'video', { url });
        quill.setSelection(currPos + 2, 0);
    };
    const videoUploaded = (url: string) => {
        const videoDom = document.querySelector(`video[data-url="${url}"]`);
        if (!videoDom) return;
        videoDom.setAttribute('src', url);
    };
    const insertAttachment = (url: string, file: RcFile) => {
        const quill = (ref as MutableRefObject<ReactQuill>)?.current?.getEditor();
        const currPos = quill.getSelection()?.index ?? 0;
        quill.insertEmbed(currPos, 'attachment', { url, name: file.name, size: file.size });
        quill.setSelection(currPos + 2, 0);
        setTimeout(() => {
            toggleAttachmentLoading(url, true);
        }, 0);
    };
    const attachmentUploaded = (url: string) => {
        toggleAttachmentLoading(url, false);
    };
    const baseModules = useMemo(() => ({
        toolbar: {
            container: [
                [{'font': fonts}, { 'header': [1, 2, 3, 4, false] }, { 'size': sizes }],
                ['bold', 'italic', 'underline','strike'],
                ['blockquote', {'background': LightColors}, {'color': LightColors}, {'align' : []}, 'code'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['emoji', 'link', 'image', 'video', 'attachment'],
                ['clean']
            ],
            handlers: {
                'video': () => {
                    (videoRef.current?.querySelector('input') as HTMLElement)?.click();
                },
                'image': () => {
                    (imgRef.current?.querySelector('input') as HTMLElement)?.click();
                },
                'attachment': () => {
                    (attachmentRef.current?.querySelector('input') as HTMLElement)?.click();
                },
            },
        },
        blotFormatter: {},
        'emoji-toolbar': true,
        'emoji-textarea': false,
        'emoji-shortname': true,
    }), [videoRef.current, imgRef.current]);
    const readOnlyModules = { toolbar: null };
    return (
        <>
            <ImgUploader
                ref={imgRef}
                onUploaded={insertImage}
                maxSize={1}
            />
            <FileUploader
                ref={videoRef}
                accept='video/*'
                onUploaded={videoUploaded}
                onUrlFetched={insertVideo}
                maxSize={2048}
                label='视频'
            />
            <FileUploader
                ref={attachmentRef}
                onUploaded={attachmentUploaded}
                onUrlFetched={insertAttachment}
                maxSize={2048}
                label='附件'
            />
            <ReactQuill
                ref={ref}
                theme='snow'
                defaultValue={content}
                onChange={onChange}
                modules={readOnly ? readOnlyModules : baseModules}
                formats={formats}
                readOnly={readOnly}
            />
        </>
    );
});

const toggleAttachmentLoading = (url: string, loading: boolean) => {
    const attachmentDom = document.querySelector(`.${attachmentBlotClassName}[data-url="${url}"]`);
    if (!attachmentDom) return;
    console.log(attachmentDom);
    const downloadDom = attachmentDom.querySelector(`.${attachmentDownloadClassName}`) as HTMLElement;
    const loadingDom = attachmentDom.querySelector(`.${attachmentLoadingClassName}`) as HTMLElement;
    if (downloadDom) {
        downloadDom.style.display = loading ? 'none' : 'block';
    }
    if (loadingDom) {
        loadingDom.style.display = loading ? 'block' : 'none';
    }
};