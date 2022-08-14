import { Box, CircularProgress } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { List } from '../../components/articles/List';
import { useMessage } from '../../hooks/useMessage';
import { ArticleListFilters, IArticleData } from '../../service/interface';
import { service } from '../../service/mock-service';

export const MineArticles: FC<{
    filters: ArticleListFilters,
}> = props => {
    const { filters } = props;
    const [list, setList] = useState<Array<IArticleData>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [start, setStart] = useState<number>(0);
    const { notification } = useMessage();
    const fetchData = async (
        start: number,
        filters: ArticleListFilters,
        prevList: IArticleData[],
    ) => {
        const data = await service.fetchArticleList({
            search_key: '',
            filters,
            sorter: {
                key: 'create_time',
                order: 'descend',
            },
            range: {
                start,
                count: 10,
            }
        });
        setTotal(data.total);
        setStart(start + data.data.length);
        setList([...prevList, ...data.data]);
    };
    const loadMore = async () => {
        await fetchData(start, filters, list);
    };
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                await fetchData(0, filters, []);
            } catch (e) {
                notification.error({ message: '加载失败' });
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        void fetch();
    }, [filters]);
    return (
        <Box sx={Container}>
            {!loading ?
                <List list={list} total={total} loadMore={loadMore} /> :
                <CircularProgress sx={LoadingStyle} />
            }
        </Box>
    );
};

const Container = {
    width: '100%',
    padding: '0 24px',
};

const LoadingStyle = {
    display: 'block',
    margin: '32px auto 0'
};