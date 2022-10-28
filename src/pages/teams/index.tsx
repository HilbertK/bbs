import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page } from '../../utils/constants';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { getUserList } from '../../service/api';
import { Skeleton, Card, List, Spin, Empty } from 'antd';
import { useMenu } from '../hooks/useMenu';

const { Meta } = Card;

export const Teams: FC = () => {
    const dispatch = useDispatch();
    const [list, setList] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [start, setStart] = useState<number>(1);
    const fetchData = async () => {
        const data = await getUserList({
            column: 'createTime',
            order: 'desc',
            // userType: 'LAW',
            pageNo: start,
            pageSize: 10,
        });
        setTotal(data.total);
        setStart(start + 1);
        setList(prev => [...prev, ...data.records]);
    };
    const loadMoreData = async () => {
        if (loading) return;
        setLoading(true);
        await fetchData();
        setLoading(false);
    };
    useMenu(SubMenuEnum.Home, Page.Teams);
    useEffect(() => {
        const fetch = async () => {
            await loadMoreData();
        };
        void fetch();
    }, []);
    return (list.length ?
        <InfiniteScroll
            dataLength={list.length}
            next={loadMoreData}
            hasMore={list.length < total}
            loader={<Skeleton style={{ padding: '20px 50px' }} title active />}
            scrollableTarget='teams-list'
        >
            <List
                dataSource={list}
                grid={{gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3}}
                renderItem={({ realname, id, appearance, description, avatar }) => (
                    <Card
                        key={id}
                        hoverable
                        style={{ width: 300, margin: '20px auto' }}
                        cover={
                            <Box sx={{ width: '100%', height: '360px', overflow: 'hidden' }}>
                                {!!(appearance ?? avatar) && <img style={{ width: '100%', height: 'auto' }} alt={realname} src={appearance ?? avatar} />}
                            </Box>
                        }
                    >
                        <Meta title={realname} description={description} />
                    </Card>
                )}
            >
                {loading && list.length < total && (
                <div className="loading-container">
                    <Spin />
                </div>
                )}
            </List>
        </InfiniteScroll> : <Empty style={{ padding: '32px 0' }} description={false} />
    );
};
