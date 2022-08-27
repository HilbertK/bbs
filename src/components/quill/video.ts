// eslint-disable-next-line @typescript-eslint/no-var-requires
const Quill = require('quill');
const BlockEmbed = Quill.import('blots/block/embed');
export class Video extends BlockEmbed {
    static create(value: any) {
        const node = super.create();
        node.setAttribute('src', value.url);
        node.setAttribute('controls', value.controls);
        node.setAttribute('width', value.width);
        node.setAttribute('poster', value.poster);
        node.setAttribute('controlslist', 'nodownload noremoteplayback');
        node.setAttribute('oncontextmenu', 'return false');
        return node;
    }
  // 富文本初始化取参数，如果有编辑富文本的功能的话，这段代码就需要加上
    static value(node: any) {
        return {
            url: node.getAttribute('src'),
            controls: node.getAttribute('controls'),
            width: node.getAttribute('width'),
            poster: node.getAttribute('poster'),
            controlslist: node.getAttribute('controlslist'),
            oncontextmenu: node.getAttribute('oncontextmenu')
        };
    }
}
Video.blotName = 'Video';
Video.tagName = 'video';
Video.className = 'ql-video';