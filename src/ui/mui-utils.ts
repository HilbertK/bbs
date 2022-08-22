// 核心style，注意：和scss文件一致
import {createTheme} from '@mui/material';

import {Border, Palette, Spacing} from '../base/style';

export const Theme = createTheme({
    palette: {
        primary: {
            main: Palette.Brand.Normal,
        },
    },
    spacing: Spacing.FixedInPixel,
    typography: {
        fontFamily: '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    },
    components: {
        MuiButtonBase: { // button-base
            defaultProps: { // 默认属性
            },
        },
        MuiButton: {
            defaultProps: { // 默认属性
                disableRipple: true, // 关闭点击水波效果
                size: 'small',
            },
            styleOverrides: { // 覆盖style，此处可支持css-variable
                root: { // 颜色变化增加动画，方便暗黑模式
                    minWidth: 'auto',
                    transitionProperty: 'color, background-color',
                    transitionDuration: '250ms',
                    '&.MuiButton-contained:hover': {
                        backgroundColor: Palette.Brand.Hover
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small', // 默认大小small
            },
            styleOverrides: {
                root: {
                    fontSize: 'inherit', // 组件存在默认字体，此处使用继承实现
                },
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: Palette.Fill.Emphasize
                    },
                    fontSize: 'inherit', // 组件存在默认字体，此处使用继承实现
                },
            }
        },
        MuiInputBase: {
            styleOverrides: { // 覆盖style，此处可支持css-variable
                root: {
                    '&:hover':{ // 设置所有的输入框outlined模式下hover时候的颜色是主题色
                        'fieldset.MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${Palette.Fill.Emphasize}`,
                        },
                    },
                    'fieldset.MuiOutlinedInput-notchedOutline': {
                        border: Border.GrayBG,
                        borderWidth: '1px !important'
                    },
                    '&.Mui-disabled': {
                        background: Palette.Fill.LightNormal,
                        'fieldset.MuiOutlinedInput-notchedOutline': {
                            border: Border.GrayBG,
                        },
                    },
                    '&.Mui-focused': {
                        'fieldset.MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${Palette.Fill.Emphasize}`,
                            borderRadius: '4px',
                        },
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: `${Palette.Error.Default} !important`,
                    },
                    '&:after': {
                        borderBottom: `2px solid ${Palette.Fill.Emphasize} !important`,
                    },
                },

            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    '&.Mui-error': {
                        color: Palette.Error.Default,
                    }
                }
            }
        },
        MuiMenuItem: {
            defaultProps: {
                style: {
                    color: Palette.Text.Text,
                }
            },
            styleOverrides: {
                root: {
                    ':hover': {
                        backgroundColor: Palette.Fill.LightHover,
                    },
                    '&.Mui-selected': {
                        backgroundColor: Palette.Fill.LightHover,
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: Palette.Fill.LightHover,
                    },
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    whiteSpace: 'pre-wrap',
                },
                arrow: {
                    color: 'rgba(0, 0, 0, 0.8)',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    padding: 0,
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                outlined: {
                    color: Palette.Text.Text,
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    marginTop: '4px', // 下拉菜单距离输入框 4px
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: Palette.Brand.DarkBG
                    }
                }
            }
        }
    },
});