import { Box } from '@mui/material';
import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { Quill } from 'react-quill';

interface IEditorLoadingOption {
    url: string,
}
const BlockEmbed = Quill.import('blots/block/embed');

const VideoComp: FC<{ url: string }> = ({ url }) => (
    <Box
        component='video'
        sx={VideoStyle}
        src={url}
        data-url={url}
        onContextMenu={() => {}}
        controls
        controlsList='nodownload noremoteplayback'
        contentEditable='false'
    />
);
export class VideoBlot extends BlockEmbed {
    static create(options: IEditorLoadingOption) {
        const node = super.create();
        node.setAttribute('data-url', options.url);
        const container = createRoot(node);
        container.render(<VideoComp url={options.url} />);
        return node;
    }

    // 返回节点自身的value值 用于撤销操作
    static value(node: any) {
        return {
            url: node.getAttribute('data-url'),
        };
    }
}
// blotName
VideoBlot.blotName = 'video';
// class名将用于匹配blot名称
VideoBlot.className = 'ql-video';
// 标签类型自定义
VideoBlot.tagName = 'div';

const VideoStyle = {
    width: '100%'
};