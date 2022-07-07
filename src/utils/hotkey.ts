import { EventEmitter } from 'eventemitter3';
import { platform } from './platform';

export const HotKeyDictionary = {
    Undo: 'Cmd+Z', // 撤销
    Redo: 'Cmd+Y', // 重做
    Find: 'Cmd+F', // 查找
    Save: 'Cmd+S', // 保存
    Copy: 'Cmd+C', // 复制
    Cut: 'Cmd+X', // 剪切
};

const isWindows = platform.isWindows();

// change Cmd to Ctrl at windows
if (isWindows) {
    Object.keys(HotKeyDictionary).forEach(name => {
        (HotKeyDictionary as any)[name] = (HotKeyDictionary as any)[name]?.replace(/(Cmd|Opt)/g, ($0: any, $1: any) => {
            if ($1 === 'Cmd') {
                return 'Ctrl';
            }
            if ($1 === 'Opt') {
                return 'Alt';
            }
            return $1;
        });
    });
}

export enum HotKeyEvent {
    Expand = 'expand',
    InsertCol = 'insertCol',
    ClosePop = 'closePop',
}

export const HotKeyEmitter = new EventEmitter();