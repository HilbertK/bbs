import { Box } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Empty, Menu, MenuProps, Spin } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { service } from '../../service/mock-service';
import { RootState } from '../../store';
import categorySlice from './slice';
import { CategoryList, Page } from '../../utils/constants';
import { CategoryItem } from '../../base/interface';
import { contentTop, contentWidth } from '../../ui/base-utils';
import { Border, Font, Palette } from '../../base/style';
import { listWidth, menuWidth } from './constants';
import { List } from '../../components/articles/List';
import { ArticleListSorter, IArticleData } from '../../service/interface';
import { useMessage } from '../../hooks/useMessage';
import { actions, SubMenuEnum } from '../../store/menu-slice';
import { useMenu } from '../hooks/useMenu';

type MenuItems = Required<MenuProps>['items'];

type IGetMenuItems = (list: CategoryItem[]) => MenuItems;

type IGetMenuFirstItem = (list: MenuItems) => string;

const getMenuItems: IGetMenuItems = list => list.map(({ label, value, children }) => ({
  key: value,
  children: children != null ? getMenuItems(children) : null,
  label,
} as any));

const getFirstItem: IGetMenuFirstItem = list => {
  const first = list[0] as any;
  if (first.children == null) return first.key as string;
  return getFirstItem(first.children);
};

interface SorterTitle {
  title: string,
  key: string,
  sorter: ArticleListSorter,
}

const timeSorter: ArticleListSorter = {
  key: 'create_time',
  order: 'descend',
};

const hotSorter: ArticleListSorter = {
  key: 'hot',
  order: 'descend',
};

enum paramsKey {
  Filter = 'filter',
  Sorter = 'sorter'
}

export const Category: FC = () => {
  const menuItems = getMenuItems(CategoryList);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilter = searchParams.get(paramsKey.Filter) ?? getFirstItem(menuItems);
  const [start, setStart] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>(defaultFilter);
  const [currSorter, setCurrSorter] = useState<ArticleListSorter>(timeSorter);
  const [total, setTotal] = useState<number>(0);
  const list = useSelector((state: RootState) => state.category.list);
  const dispatch = useDispatch();
  const { notification } = useMessage();
  const sorterList: SorterTitle[] = [{
    title: '最新',
    key: timeSorter.key,
    sorter: timeSorter
  }, {
    title: '最热',
    key: hotSorter.key,
    sorter: hotSorter
  }];
  const onItemClick: MenuClickEventHandler = info => {
    setCategoryFilter(info.key);
  };
  const onSorterChange = (newSorter: ArticleListSorter) => () => {
    setCurrSorter(newSorter);
  };
  const fetchData = async (
    newFilter: string,
    newSorter: ArticleListSorter,
    start: number,
    prevList: IArticleData[],
  ) => {
    const data = await service.fetchArticleList({
      search_key: '',
      filters: {
        category: [newFilter]
      },
      sorter: newSorter,
      range: {
        start,
        count: 10,
      }
    });
    setTotal(data.total);
    setStart(start + data.data.length);
    dispatch(categorySlice.actions.setList([...prevList, ...data.data]));
  };
  const loadMore = async () => {
    await fetchData(categoryFilter, currSorter, start, list);
  };
  useMenu(SubMenuEnum.Home, Page.Category);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setSearchParams({
        sorter: currSorter.key,
        filter: categoryFilter,
      });
      setStart(0);
      dispatch(categorySlice.actions.setList([]));
      try {
        await fetchData(categoryFilter, currSorter, 0, []);
      } catch (e) {
        notification.error({message: '加载失败'});
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [categoryFilter, currSorter]);
  return (
    <Box sx={Container}>
      <Box sx={MenuContainer}>
        <Menu
          mode='vertical'
          style={{
            width: '100%',
            border: Border.GrayBG,
            borderRadius: '4px',
          }}
          items={menuItems}
          onClick={onItemClick}
          defaultSelectedKeys={[defaultFilter]}
        />
      </Box>
      {!loading ? <Box sx={ListContainer}>
        <Box sx={SorterContainer}>
          {sorterList.map(({ title, key, sorter }) => (
            <Box
              sx={{
                ...SorterItem,
                ...(currSorter.key === key ? { color: Palette.Brand.Default } : {})
              }}
              key={key}
              onClick={onSorterChange(sorter)}
            >{title}</Box>
          ))}
        </Box>
        {list.length ?
          <List list={list} total={total} loadMore={loadMore} />
          : <Empty style={{ padding: '32px 0' }} description={false} />
        }
      </Box> : <Spin style={{ margin: '32px auto 0' }} />}
    </Box>
  );
};

const Container = {
  width: `${contentWidth}px`,
  paddingTop: `${contentTop}px`,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
};

const MenuContainer = {
  width: `${menuWidth}px`
};

const ListContainer = {
  width: `${listWidth}px`
};

const SorterContainer = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 0',
  borderBottom: `1px solid ${Palette.Line.DarkNormal}`
};

const SorterItem = {
  ...Font.TitleMedium,
  color: Palette.Text.Asider,
  marginRight: '16px',
  cursor: 'pointer',
  '&:hover': {
    color: Palette.Brand.Hover
  }
};