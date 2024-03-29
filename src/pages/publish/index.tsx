import { Box, Button } from '@mui/material';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Border, Font, Palette, RoundCorner, Shadow } from '../../base/style';
import { Input } from '../../components/Input';
import { service } from '../../service/mock-service';
import { CategoryList, Page } from '../../utils/constants';
import { CascaderMenu } from '../../components/CascaderMenu';
import { Editor } from '../../components/quill/Editor';
import { CatalogItem } from '../../base/interface';
import { BaseButtonStyle, contentTop, SingleText } from '../../ui/base-utils';
import { publishStorageService } from './Storage';
import isString from 'lodash-es/isString';
import { getArticleLink } from '../../utils/util';
import { catalogWidth } from '../article/constants';
import { useMessage } from '../../hooks/useMessage';
import { ArticleParams } from '../../service/interface';
import { useDispatch } from 'react-redux';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { useMenu } from '../hooks/useMenu';

export const Publish: FC = () => {
    const storageData = publishStorageService.getStoragePublishArticle();
    const [content, setContent] = useState<string>(storageData?.data ?? '');
    const [title, setTitle] = useState<string>(storageData?.title ?? '');
    const [description, setDescription] = useState<string>(storageData?.description ?? '');
    const [headingList, setHeadingList] = useState<CatalogItem[]>([]);
    const [category, setCategory] = useState<string[]>(storageData?.category ?? []);
    const editorRef = useRef<ReactQuill>(null);
    const { notification } = useMessage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const generateCatalog = () => {
        let newHeadingList: CatalogItem[] = [];
        editorRef.current?.getEditor().getContents().eachLine((line, attr) => {
            if (!attr.header) return;
            const title = line.map(item => isString(item.insert) ? item.insert : '').join('');
            newHeadingList.push({
                level: attr.header,
                title,
            });
        });
        setHeadingList(newHeadingList);
    };
    const storeArticle = (params: Partial<ArticleParams>) => {
        publishStorageService.setContentStorage({
            category,
            title,
            description,
            data: content,
            ...params,
        });
    };
    const setEditorContent = useCallback(_debounce((newContent: string) => {
        setContent(newContent);
        storeArticle({ data: newContent });
        generateCatalog();
    }, 500), [editorRef.current]);
    const setTitleWithStorage = (newValue: string) => {
        setTitle(newValue);
        storeArticle({ title: newValue });
    };
    const setDescriptionWithStorage = (newValue: string) => {
        setDescription(newValue);
        storeArticle({ description: newValue });
    };
    const setCategoryWithStorage = (newValue: string[]) => {
        setCategory(newValue);
        storeArticle({ category: newValue });
    };
    const onPublish = useCallback(async () => {
        if (title === '') {
            notification.warning({ message: '请输入标题' });
            return;
        }
        if (content.length === 0) {
            notification.warning({ message: '请输入内容' });
            return;
        }
        if (category.length === 0) {
            notification.warning({ message: '未选择分类' });
            return;
        }
        try {
            const newId = await service.publishArticle({
                category,
                title,
                description,
                data: content,
            });
            setContent('');
            setTitle('');
            publishStorageService.clearContentStorage();
            notification.success({ message: '发布成功' });
            navigate(getArticleLink(newId));
        } catch (e) {
            console.error(e);
            notification.error({ message: '发布失败，请重试' });
        }
    }, [content, title, category, publishStorageService]);
    useMenu(SubMenuEnum.Home, Page.Publish);
    useEffect(() => {
        const storageContent = publishStorageService.getStoragePublishArticle();
        if (
            storageContent == null ||
            (storageContent.data === '' &&
            storageContent.title === '' &&
            storageContent.description === '')
        ) return;
        notification.info({ message: '从上次编辑处恢复' });
        generateCatalog();
    }, []);
    return (
        <Box sx={PublishContainer}>
            <Box sx={ContentContainer}>
                <Input
                    sx={InputTitleContent}
                    maxRows={1}
                    maxLength={100}
                    placeholder='请输入标题'
                    value={title}
                    onChange={setTitleWithStorage}
                />
                <Input
                    sx={InputDesContent}
                    maxRows={4}
                    minRows={4}
                    maxLength={150}
                    placeholder='请输入摘要，推荐在150个字以内'
                    value={description}
                    onChange={setDescriptionWithStorage}
                />
                <Box sx={EditorContainer}>
                    <Editor
                        onChange={setEditorContent}
                        content={content}
                        readOnly={false}
                        ref={editorRef}
                    />
                </Box>
                <Box sx={SubmitContainer}>
                    <Box sx={CategoryContainer}>
                        <Box sx={{ marginRight: '16px' }}>分类</Box>
                        <CascaderMenu options={CategoryList} onChange={setCategoryWithStorage} />
                    </Box>
                    <Button
                        variant='contained'
                        onClick={onPublish}
                        sx={BaseButtonStyle}
                    >发布</Button>
                </Box>
            </Box>
            <Box sx={CatalogContainer}>
                <Box sx={CatalogTitle}>目录</Box>
                {headingList.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            ...SingleText,
                            paddingLeft: `${item.level * 5}px`
                        }}
                    >{item.title}</Box>
                ))}
            </Box>
        </Box>
    );
};

const PublishContainer = {
    padding: `${contentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
    display: 'flex',
};

const BaseBlockStyle = {
    backgroundColor: '#fff',
    boxShadow: Shadow.Light,
    borderRadius: RoundCorner(1),
};

const ContentContainer = {
    ...BaseBlockStyle,
    width: '100%',
    padding: '32px',
    marginRight: '20px',
};

const InputTitleContent = {
    ...Font.TitleHuge,
    height: 'fit-content',
    color: Palette.Text.Title,
};

const InputDesContent = {
    marginTop: '16px',
    ...Font.TextMedium,
    height: 'fit-content',
    color: Palette.Text.Text,
};

const EditorContainer = {
    marginTop: '16px',
    border: Border.GrayBG,
    padding: '10px',
    borderRadius: RoundCorner(1),
    color: Palette.Text.Text,
};

const CategoryContainer = {
    ...Font.TextMedium,
    color: Palette.Text.Text,
    display: 'flex',
    alignItems: 'center',
};

const SubmitContainer = {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
};

const CatalogContainer = {
    ...BaseBlockStyle,
    flexShrink: 0,
    height: 'fit-content',
    width: `${catalogWidth}px`,
    minHeight: `${catalogWidth}px`,
    padding: '20px',
};

const CatalogTitle = {
    ...Font.TitleMediumBold,
    color: Palette.Text.Title,
    marginBottom: '10px',
};