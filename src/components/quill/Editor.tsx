import { forwardRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import {v4 as uuid} from 'uuid';
import { Video } from './video';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import { Light } from '../../base/style';
import './editor.scss';
import { uploadManager } from '../UploadManager';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Emoji = require('quill-emoji');
interface IEditor {
    onChange?: (value: string) => void,
    readOnly?: boolean,
    content?: string,
}

Quill.register({
    'modules/emoji': Emoji,
    'modules/video': Video,
}, true);

const LightColors = Object.values(Light).reduce((prev: string[], curr) => ([...prev, ...Object.values(curr).slice(-7)]), []);

const formats = [
    'font', 'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'code',
    'background', 'color',
    'list', 'bullet', 'indent', 'emoji',
    'link', 'image', 'video'
];

export const Editor = forwardRef<ReactQuill, IEditor>((props, ref) => {
    const { content, onChange = () => {}, readOnly } = props;
    const baseModules = {
        toolbar: {
            container: [
                [{'font': []}, { 'header': [1, 2, 3, 4, false] }, { 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline','strike'],
                ['blockquote', {'background': LightColors}, {'color': LightColors}, {'align' : []}, 'code'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['emoji', 'link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                'video': (...args: any[]) => {
                    console.log(args);
                    uploadManager.openUploadModal('quill-video', '视频', () => {});
                }
            },
        },
        'emoji-toolbar': true,
        'emoji-textarea': false,
        'emoji-shortname': true,
    };
    const readOnlyModules = { toolbar: null };
    return (
        <ReactQuill
            ref={ref}
            theme='snow'
            defaultValue={content}
            onChange={onChange}
            modules={readOnly ? readOnlyModules : baseModules}
            formats={formats}
            readOnly={readOnly}
        />
    );
});
