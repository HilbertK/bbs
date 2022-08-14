declare module '*.json';

declare module '*.xml';

declare module '*.html';

declare module '*.jpg';

declare module '*.png';

declare const __node_env__: 'development' | 'testing' | 'production';

declare const __base_name__: string;

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T,
};
