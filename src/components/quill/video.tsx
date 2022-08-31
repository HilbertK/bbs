import { Quill } from 'react-quill';

interface IEditorLoadingOption {
    url: string,
}
const BlockEmbed = Quill.import('blots/block/embed');
export class VideoBlot extends BlockEmbed {
    static create(options: IEditorLoadingOption) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('controls', 'controls');
        node.setAttribute('controlslist', 'nodownload noremoteplayback');
        node.setAttribute('oncontextmenu', 'return false');
        node.setAttribute('width', '100%');
        node.setAttribute('src', options.url);
        node.setAttribute('data-url', options.url);
        return node;
    }

    // 返回节点自身的value值 用于撤销操作
    static value(node: any) {
        return {
            url: node.getAttribute('src'),
            dataUrl: node.getAttribute('data-url'),
            controls: node.getAttribute('controls'),
            width: node.getAttribute('width'),
            poster: node.getAttribute('poster'),
            controlslist: node.getAttribute('controlslist'),
            oncontextmenu: node.getAttribute('oncontextmenu')
        };
    }
}
// blotName
VideoBlot.blotName = 'video';
// class名将用于匹配blot名称
VideoBlot.className = 'ql-video';
// 标签类型自定义
VideoBlot.tagName = 'video';