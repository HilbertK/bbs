import { DatePicker, Table, Popconfirm } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ColumnFilterItem, SorterResult, FilterValue, FilterDropdownProps } from 'antd/es/table/interface';
import zhCN from 'antd/es/locale/zh_CN';
import { FC, useEffect, useState } from 'react';
import { CategoryItem } from '../../base/interface';
import { ArticleListFilters, ArticleListParams, IArticleData } from '../../service/interface';
import { service } from '../../service/mock-service';
import { Category, CategoryDict, CategoryList } from '../../utils/constants';
import { calcArticleHot } from '../../utils/util';
import { Box, Button, Tooltip } from '@mui/material';
import { Input } from '../Input';
import moment from 'moment';
import { timeFormat } from '../../service/constants';

type IGetCategoryFilterItems = (list: CategoryItem[]) => ColumnFilterItem[];
const getCategoryFilterItems: IGetCategoryFilterItems = list => list.map(({ label, value, children }) => ({
    value,
    children: children != null ? getCategoryFilterItems(children) : null,
    text: label,
} as any));

const initPagination  = {
    current: 1,
    pageSize: 10,
};

export const TableList: FC<{
    selectable?: boolean,
    onSelect?: (ids: string[]) => void,
}> = props => {
    const [searchKey, setSearchKey] = useState<string>('');
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<IArticleData>>({});
    const { selectable = false, onSelect } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>(initPagination);
    const [list, setList] = useState<Array<IArticleData>>([]);
    const fetchData = async (params: ArticleListParams, newPagination: TablePaginationConfig) => {
        setLoading(true);
        const newData = await service.fetchArticleList(params);
        setList(newData.data);
        setLoading(false);
        setPagination({
            ...newPagination,
            total: newData.total,
        });
    };
    const handleTableChange = async (
        newPagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<IArticleData> | SorterResult<IArticleData>[],
    ) => {
        const newSorter = sorter as SorterResult<IArticleData>;
        setFilteredInfo(filters);
        setSortedInfo(newSorter);
        const current = pagination.current ?? 1;
        const size = pagination.pageSize ?? 10;
        await fetchData({
            search_key: searchKey,
            sorter: {
                key: newSorter.field?.toString() ?? '',
                order: newSorter.order ?? null,
            },
            filters: filters as ArticleListFilters,
            range: {
                start: (current - 1) * size,
                count: size,
            }
        }, newPagination);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[], selectRows: IArticleData[]) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        onSelect?.(selectRows.map(item => item.id));
    };
    const onCreateTimeFilterChange = (props: FilterDropdownProps) => (value: any, dateString: string) => {
        props.confirm({ closeDropdown: true });
        void handleTableChange(pagination, {
            ...filteredInfo,
            create_time: dateString === '' ? null : [dateString]
        }, sortedInfo);
    };
    const onSearch = () => {
        void handleTableChange(initPagination, filteredInfo, sortedInfo);
    };
    useEffect(() => {
        const fetch = async () => {
            await fetchData({
                search_key: '',
                sorter: null,
                filters: null,
                range: {
                    start: (initPagination.current - 1) * initPagination.pageSize,
                    count: initPagination.pageSize,
                }
            }, initPagination);
        };
        void fetch();
    }, []);
    const columns: ColumnsType<IArticleData> = [
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            width: '20%',
        },
        {
            title: '简介',
            dataIndex: 'description',
            ellipsis: true,
            width: '20%',
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            filters: getCategoryFilterItems(CategoryList),
            render: (_, record) => record.category.map(item => CategoryDict[item as Category].label).join('/'),
            filteredValue: filteredInfo.category || null,
        },
        {
            title: '发布时间',
            dataIndex: 'create_time',
            sorter: true,
            width: '10%',
            filterDropdown: props => <DatePicker onChange={onCreateTimeFilterChange(props)} />,
            filteredValue: filteredInfo.create_time || null,
            render: (_, record) => moment(parseInt(record.create_time, 10)).format(timeFormat)
        },
        {
            title: '热度',
            dataIndex: 'hot',
            sorter: true,
            width: '8%',
            render: (_, record) => (
                <Tooltip
                    title={`浏览:${record.view_num} 点赞:${record.like_num} 评论:${record.comments.length} 收藏:${record.collect_num}`}
                    arrow
                    placement="top-start"
                    enterTouchDelay={500}
                    enterDelay={500}
                    enterNextDelay={500}
                >
                    <Box sx={{ textAlign: 'center' }}>{calcArticleHot(record)}</Box>
                </Tooltip>
            ),
        },
        {
            title: '操作',
            dataIndex: '',
            render: () => [
                <a
                    key="editable"
                    onClick={() => {}}
                >
                    编辑
                </a>,
                <a target="_blank" rel="noopener noreferrer" key="view">
                    查看
                </a>,
                <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={() => {}}
                    okText="删除"
                    cancelText="取消"
                    key='delete'
                >
                    <a href="#">删除</a>
                </Popconfirm>
            ],
        },
    ];
    return (
        <Box>
            <Box sx={SearchContainerStyle}>
                <Input
                    sx={SearchInputStyle}
                    maxRows={1}
                    maxLength={100}
                    placeholder='请输入搜索词'
                    value={searchKey}
                    onChange={setSearchKey}
                />
                <Button
                    sx={{ marginLeft: '10px' }}
                    variant='contained'
                    onClick={onSearch}
                >搜索</Button>
            </Box>
            <Table
                locale={zhCN.Table}
                columns={columns}
                rowSelection={selectable ? {
                    selectedRowKeys,
                    preserveSelectedRowKeys: true,
                    onChange: onSelectChange,
                } : undefined}
                rowKey={record => record.id}
                dataSource={list}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </Box>
    );
};

const SearchContainerStyle = {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
};

const SearchInputStyle = {
    width: '200px',
};