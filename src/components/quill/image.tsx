import { Box } from '@mui/material';
import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { Quill } from 'react-quill';
import { Palette } from '../../base/style';

interface IEditorLoadingOption {
    url: string,
}

const ImageComp: FC<{ url: string }> = ({ url }) => (
    <Box sx={ImageContainerStyle}>
        <Box sx={ImageStyle} component='img' src={url} data-url={url} />
    </Box>
);

const BlockEmbed = Quill.import('blots/block/embed');
export class ImageBlot extends BlockEmbed {
    static create(options: IEditorLoadingOption) {
        const node = super.create();
        node.setAttribute('data-url', options.url);
        const container = createRoot(node);
        container.render(<ImageComp url={options.url} />);
        return node;
    }

    static value(node: any) {
        return {
            url: node.getAttribute('data-url')
        };
    }
}
// blotName
ImageBlot.blotName = 'image';
// class名将用于匹配blot名称
ImageBlot.className = 'ql-image';
// 标签类型自定义
ImageBlot.tagName = 'image';

const ImageContainerStyle = {
    position: 'relative',
    minWidth: '400px',
    minHeight: '400px',
    margin: '0 auto',
    height: 'fit-content',
    width: 'fit-content',
    background: Palette.Fill.GrayBG,
};

const ImageStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
};