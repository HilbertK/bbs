import { Quill } from 'react-quill';

interface IEditorLoadingOption {
    url: string,
    width?: string,
    height?: string,
    style?: string,
}

const BlockEmbed = Quill.import('blots/block/embed');
export class ImageBlot extends BlockEmbed {
    static create(options: IEditorLoadingOption) {
        const node = super.create();
        const { url, width, height, style } = options;
        node.setAttribute('src', url);
        if (width) node.setAttribute('width', width);
        if (height) node.setAttribute('height', height);
        if (style) node.setAttribute('style', style);
        return node;
    }

    static value(node: any) {
        return {
            url: node.getAttribute('src'),
            width: node.getAttribute('width'),
            height: node.getAttribute('height'),
            style: node.getAttribute('style'),

        };
    }
}
// blotName
ImageBlot.blotName = 'image';
// class名将用于匹配blot名称
ImageBlot.className = 'ql-image';
// 标签类型自定义
ImageBlot.tagName = 'img';