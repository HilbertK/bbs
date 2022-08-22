import { Font, Palette, RoundCorner } from '../base/style';
import { calcWidth } from '../utils/util';

export const SingleText = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
};

export const TextFieldStyle = {
    fontSize: 'inherit',
    color: 'inherit',
    lineHeight: 'inherit',
    width: '100%',
    height: '100%',
    '& .MuiInputBase-root': {
        background: '#fff',
        color: 'inherit',
        fontSize: 'inherit',
        height: '100%',
    },
};

export const ContentCenterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const ButtonBaseStyle = (color: string) =>  ({
    ...Font.TextMedium,
    cursor: 'pointer',
    padding: '4px 15px',
    borderRadius: RoundCorner(6),
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        color: '#fff',
        borderColor: color
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: '-80%',
        top: '25%',
        margin: 'auto',
        width: 0,
        height: 0,
        transformOrigin: 'center center',
        transform: 'scale(.5)',
        transition: 'transform .55s ease',
        backfaceVisibility: 'hidden',
        backgroundColor: color,
        zIndex: 0,
        borderRadius: '50%',
    },
    '&:hover::before': {
        width: '100%',
        height: '300%',
        transform: 'scale(3)',
    },
});

export const TabBaseStyle = {
    color: Palette.Text.Title,
    '&.Mui-selected': {
        color: Palette.Brand.Clicked
    },
    '&:hover': {
        color: Palette.Brand.Hover,
        opacity: 1
    },
    '&.Mui-selected:hover': {
        color: Palette.Brand.Clicked
    },
};

export const TabsBaseStyle = {
    '& .MuiTabs-indicator': {
        backgroundColor: Palette.Brand.Default
    },
};

export const BaseButtonStyle = {
    padding: '4px 15px'
};

export const GrayOutlineButtonStyle = {
    border: `1px solid ${Palette.Fill.Normal}`,
    color: Palette.Fill.Normal,
    '&:hover': {
        border: `1px solid ${Palette.Fill.Emphasize}`,
        color: Palette.Fill.Emphasize,
    },
    padding: '4px 15px'
};

export const contentWidth = calcWidth(1080);
export const contentMinHeight = 'calc(100vh - 64px)';
export const contentTop = calcWidth(32);
export const blockSpacing = calcWidth(16);
export const headerMenuHeight = 64;

export const antdColor = {
    primaryColor: Palette.Brand.Clicked,
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
};