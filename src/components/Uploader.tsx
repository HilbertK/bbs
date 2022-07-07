import React, {useMemo, useRef} from 'react';
import {Box, SxProps, Theme} from '@mui/material';
import {useDropzone, Accept} from 'react-dropzone';
import {Palette} from '../base/style';

export const defaultMaxFileSize = 20971520;

export interface UploaderProps {
    onDrop: (acceptedFiles: File[]) => void | Promise<void>,
    accept: Accept,
    maxFiles: number,
    multiple: boolean,
    maxSize?: number,
    disabled?: boolean,
    sx?: SxProps<Theme>,
    children?: React.ReactNode,
}

export const Uploader: React.FC<UploaderProps> = props => {
    const {
        maxFiles, maxSize = defaultMaxFileSize, multiple,
        accept, onDrop, children, sx = {}, disabled = false,
    } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files == null) {
            return;
        }
        void onDrop(Array.from(files));
        if (fileInputRef.current != null) {
            fileInputRef.current.value = '';
        }
    };
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragActive,
        isDragReject
    } = useDropzone({
        noClick: true,
        accept,
        onDrop,
        maxFiles,
        multiple,
        maxSize,
        disabled,
    });
    const style = useMemo(() => ({
        ...BaseStyle,
        ...(isFocused ? FocusedStyle : {}),
        ...(isDragActive ? ActiveStyle : {}),
        ...(isDragReject ? RejectStyle : {})
    }), [
        isFocused,
        isDragActive,
        isDragReject
    ]);
    const extraClassName = useMemo(() => ([
        isFocused ? 'focused' : '',
        isDragActive ? 'active' : '',
        isDragReject ? 'reject' : '',
    ].filter(Boolean).join(' ')), [
        isFocused,
        isDragActive,
        isDragReject
    ]);
    return (
        <Box
            sx={{
                ...sx,
                '&:hover': {
                    backgroundColor: Palette.Base.LightBG,
                    color: Palette.Base.Clicked,
                    borderColor: Palette.Base.Hover,
                }
            }}
            {...getRootProps(style)}
            className={extraClassName}
            onClick={handleClick}
        >
            <Box
                component='input'
                {...getInputProps()}
                onChange={handleFileChange}
                ref={fileInputRef}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
            {children}
        </Box>
    );
};

const BaseStyle = {
    backgroundColor: Palette.Fill.LightNormal,
    color: Palette.Text.Asider,
    border: `1px dashed ${Palette.Line.GrayBG}`,
};

const FocusedStyle = {
    borderColor: Palette.Base.Hover,
};

const ActiveStyle = {
    backgroundColor: Palette.Base.LightBG,
    color: Palette.Base.Clicked,
    borderColor: Palette.Base.Hover,
};

const RejectStyle = {
    color: Palette.Error.Clicked,
    borderColor: Palette.Error.Hover,
};