import { Box } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Page } from '../../utils/constants';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { getUserList } from '../../service/api';
import { Skeleton, Card, List, Spin } from 'antd';

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
    useEffect(() => {
        dispatch(actions.setCurrSubMenu(SubMenuEnum.Home));
        dispatch(actions.setTopSubMenu(Page.Teams));
    }, []);
    useEffect(() => {
        const fetch = async () => {
            await loadMoreData();
        };
        void fetch();
    }, []);
    return (
        <Box>
            <InfiniteScroll
                dataLength={list.length}
                next={loadMoreData}
                hasMore={list.length < total}
                loader={<Skeleton style={{ padding: '20px 0' }} title active />}
                scrollableTarget='teams-list'
            >
                <List
                    dataSource={list}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}
                    renderItem={({ realname, id, appearance, description, avatar }) => (
                        <Card
                            key={id}
                            hoverable
                            style={{ width: 240, marginBottom: '20px' }}
                            cover={
                                <Box sx={{ width: '100%', height: '360px' }}>
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
            </InfiniteScroll>
        </Box>
    );
};
