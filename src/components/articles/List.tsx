import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { Skeleton } from 'antd';
import ViewIcon from '@mui/icons-material/VisibilityOutlined';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IArticleData } from '../../service/interface';
import moment from 'moment';
import { Border, Font, Palette } from '../../base/style';
import { SingleText } from '../../ui/base-utils';
import { useNavigate } from 'react-router-dom';
import { getArticleLink } from '../../utils/util';

const listId = 'article-list';

export const List: FC<{
    list: Array<IArticleData>,
    total: number,
    loadMore: () => Promise<void>,
}> = props => {
    const { list, total, loadMore } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const loadMoreData = async () => {
        if (loading) return;
        setLoading(true);
        await loadMore();
        setLoading(false);
    };
    const onTitleClick = (id: string) => () => {
        navigate(getArticleLink(id));
    };
    return (
        <Box
            id={listId}
            sx={ContainerStyle}
        >
            <InfiniteScroll
                dataLength={list.length}
                next={loadMoreData}
                hasMore={list.length < total}
                loader={<Skeleton style={{ padding: '20px 0' }} title paragraph={{ rows: 3 }} active />}
                scrollableTarget={listId}
            >
                {list.map(({ title, description, author, create_time, view_num, id }) => (
                    <Box sx={ItemStyle} key={id}>
                        <Box sx={TitleStyle} onClick={onTitleClick(id)}>{title}</Box>
                        <Box sx={DescriptionStyle}>{description}</Box>
                        <Box sx={FooterStyle}>
                            <Box sx={FooterInfoStyle}>
                                <Box sx={AuthorStyle}>{author}</Box>
                                <Box sx={TimeStyle}>{moment(parseInt(create_time, 10)).fromNow()}</Box>
                            </Box>
                            <Box sx={{ ...FooterInfoStyle, color: Palette.Text.Tip}}>
                                <ViewIcon fontSize='small' />
                                <Box sx={ViewNumStyle}>{view_num}</Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </InfiniteScroll>
        </Box>
    );
};

const ContainerStyle = {
    height: '100%',
    overflow: 'auto',
};

const ItemStyle = {
    padding: '20px 0',
    borderBottom: Border.DarkNormal,
    '&:hover': {
        borderBottom: `1px solid ${Palette.Brand.Default}`,
    },
    '&:last-child': {
        border: 'none',
    },
};

const TitleStyle = {
    ...SingleText,
    ...Font.TitleLargeBold,
    color: Palette.Text.Title,
    cursor: 'pointer'
};

const DescriptionStyle = {
    ...Font.TextMedium,
    color: Palette.Text.Asider,
    margin: '8px 0 32px',
    height: '50px',
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
};

const FooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const FooterInfoStyle = {
    display: 'flex',
    alignItems: 'center',
};

const AuthorStyle = {
    ...Font.TextMedium,
    color: Palette.Text.Text,
};

const TimeStyle = {
    marginLeft: '12px',
    color: Palette.Text.Tip,
};

const ViewNumStyle = {
    marginLeft: '5px',
};

const NoContent = {
    ...Font.TextMedium,
    color: Palette.Text.Tip,
    padding: '16px 0'
};