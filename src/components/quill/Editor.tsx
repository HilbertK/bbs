import { forwardRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import { Light } from '../../base/style';
import './editor.scss';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Emoji = require('quill-emoji');
interface IEditor {
    onChange?: (value: string) => void,
    readOnly?: boolean,
    content?: string,
}

Quill.register({
    'modules/emoji': Emoji,
}, true);

const LightColors = Object.values(Light).reduce((prev: string[], curr) => ([...prev, ...Object.values(curr).slice(-7)]), []);

const baseModules = {
    toolbar: [
        [{'font': []}, { 'header': [1, 2, 3, 4, false] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline','strike'],
        ['blockquote', {'background': LightColors}, {'color': LightColors}, {'align' : []}, 'code'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['emoji', 'link', 'image', 'video'],
        ['clean']
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
};

const readOnlyModules = { toolbar: null };

const formats = [
    'font', 'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'code',
    'background', 'color',
    'list', 'bullet', 'indent', 'emoji',
    'link', 'image', 'video'
];

export const Editor = forwardRef<ReactQuill, IEditor>((props, ref) => {
    const { content, onChange = () => {}, readOnly } = props;
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
