import { Font, RoundCorner } from '../base/style';

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

export const contentWidth = 1080;
export const contentTop = 32;