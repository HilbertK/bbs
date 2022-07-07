import { Box } from '@mui/material';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { service } from '../../service/mock-service';
import { operateErrorTips } from '../../service/constants';
import { Loading } from './Loading';
import { Font, Light, Palette, RoundCorner } from '../../base/style';
import { Editor } from '../../components/quill/Editor';
import { articleWidth, catalogWidth } from './constants';
import { blockSpacing, ButtonBaseStyle, ContentCenterStyle, contentTop, SingleText } from '../../ui/base-utils';
import LikeIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StarIcon from '@mui/icons-material/StarBorderOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import acticleSlice from './slice';
import { useSearchParams } from 'react-router-dom';

export const Article: FC = () => {
    const article = useSelector((state: RootState) => state.article.data);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const onLike = async () => {
        if (article == null) return;
        try {
            const newArticle = await service.toggleArticleLike(article.id);
            dispatch(acticleSlice.actions.setData(newArticle));
            enqueueSnackbar(article.like ? '已取消点赞' : '已点赞', { variant: 'success' });
        } catch {
            enqueueSnackbar(operateErrorTips, { variant: 'error' });
        }
    };
    const onCollect = async () => {
        if (article == null) return;
        try {
            const newArticle = await service.toggleArticleCollect(article.id);
            dispatch(acticleSlice.actions.setData(newArticle));
            enqueueSnackbar(article.collect ? '已取消收藏' : '已收藏', { variant: 'success' });
        } catch {
            enqueueSnackbar(operateErrorTips, { variant: 'error' });
        }
    };
    useEffect(() => {
        const articleId = searchParams.get('id');
        if (articleId == null) return;
        const fetch = async () => {
            setLoading(true);
            const article = await service.fetchArticle(articleId);
            if (article != null) {
                dispatch(acticleSlice.actions.setData(article));
            }
            setLoading(false);
        };
        dispatch(acticleSlice.actions.setData(null));
        void fetch();
    }, []);
    const articleData = useMemo(() => {
        let articleContent = '';
        if (article?.data == null) return;
        try {
            articleContent = article.data;
        } catch (e) {
            console.error(e);
        }
        return articleContent;
    }, [article]);
    const articleDataList = useMemo(() => article != null ? [{
        title: '浏览',
        total: article.view_num,
    }, {
        title: '点赞',
        total: article.like_num
    }, {
        title: '收藏',
        total: article.collect_num,
    }] : [], [article]);
    return (
        <Box sx={{paddingTop: `${contentTop}px`}}>
            {!loading ? (article != null ?  (
                <Box sx={ArticleContainer}>
                    <Box sx={ArticleContent}>
                        <Box sx={TitleContainer}>{article.title}</Box>
                        <Editor content={articleData} readOnly />
                    </Box>
                    <Box sx={SideContainer}>
                        <Box sx={ExtraContainer}>
                            <Box sx={OperationContainer}>
                                {articleDataList.map(({ title, total }) => (
                                    <Box sx={ExtraItemContainer} key={title}>
                                        <Box sx={ExtraTotal}>{total ?? 0}</Box>
                                        <Box sx={ExtraTitle}>{title}</Box>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ padding: '0 0 24px', ...ContentCenterStyle }}>
                                <Box sx={LikeButton(article.like)} onClick={onLike}>
                                    <Box sx={ButtonText}>
                                        <LikeIcon fontSize='small' />
                                        点赞
                                    </Box>
                                </Box>
                                <Box sx={CollectionButton(article.collect)} onClick={onCollect}>
                                    <Box sx={ButtonText}>
                                        <StarIcon fontSize='small' />
                                        收藏
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={CatalogContainer}>

                        </Box>
                    </Box>
                </Box>
            ) : <Box sx={{ textAlign: 'center' }}>暂无数据</Box>) : <Loading />}
        </Box>
    );
};

const TitleContainer = {
    ...Font.OperationLarge,
    fontWeight: '400',
    color: Palette.Text.Title,
    paddingBottom: '20px',
};

const ArticleContainer = {
    display: 'flex',
    justifyContent: 'center',
};

const ArticleContent = {
    width: `${articleWidth}px`,
    marginRight: '40px',
};

const SideContainer = {
    flexShrink: 0,
    width: `${catalogWidth}px`,
    minWidth: '160px'
};

const ExtraContainer = {
    backgroundColor: Palette.Fill.LightNormal,
    borderRadius: RoundCorner(1),
    width: '100%',
};

const OperationContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
};

const ExtraItemContainer = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    maxWidth: '33%',
};

const ExtraTitle = {
    ...Font.AiderMedium,
    color: Palette.Fill.Weaken,
    marginTop: '6px'
};

const ExtraTotal = {
    ...SingleText,
    ...Font.OperationSmall,
    fontWeight: '700'
};

const LikeButton = (active: boolean) => ({
    ...ButtonBaseStyle('#d32f2f'),
    color: '#d32f2f',
    border: '1px solid #d32f2f',
    ...(active ? {
        color: '#fff',
        backgroundColor: '#d32f2f',
    } : {})
});

const CollectionButton = (active: boolean) => ({
    ...ButtonBaseStyle(Light.Yellow[500]),
    marginLeft: `${blockSpacing}px`,
    color: '#595959',
    border:'1px solid #595959',
    borderRadius: RoundCorner(6),
    ...(active ? {
        color: '#fff',
        border: `1px solid ${Light.Yellow[500]}`,
        backgroundColor: Light.Yellow[500],
    } : {})
});

const ButtonText = {
    position: 'relative',
    whiteSpace: 'nowrap',
    ...ContentCenterStyle,
};
const CatalogContainer = {};