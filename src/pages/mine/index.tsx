import { Box, Tab, Tabs } from '@mui/material';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Font, Palette, RoundCorner, Shadow } from '../../base/style';
import { Avatar } from '../../components/avatar/Avatar';
import { RootState } from '../../store';
import { contentTop, contentWidth, headerMenuHeight, TabBaseStyle, TabsBaseStyle } from '../../ui/base-utils';
import { MineArticles } from './Articles';
import { mineCenterAvatarSize, mineCenterContentTop, mineCenterInfoContentSize, mineDetailContentWidth, mineDetailSiderWidth } from './constants';

export const Mine: FC = () => {
    const userInfo = useSelector((state: RootState) => state.mine.userInfo);
    const [checkedTab, setCheckedTab] = useState<number>(0);
    if (userInfo === null) return null;
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCheckedTab(newValue);
    };
    const menuList = [{
        title: '文章',
        comp: <MineArticles filters={{ author: [userInfo.name] }} />
    }, {
        title: '收藏',
        comp: <MineArticles filters={{ collect: [true] }} />
    }, {
        title: '学习'
    }];
    return (
        <Box sx={MineContainer}>
            <Box sx={ContentContainer}>
                <Box sx={InfoContainer}>
                    <Box sx={AvatarContainer}>
                        <Avatar
                            url={userInfo.avatar}
                            name={userInfo.name}
                            size={mineCenterAvatarSize}
                            isRound={false}
                        />
                    </Box>
                    <Box sx={InfoContent}>
                        <Box sx={NameStyle}>{userInfo.name}</Box>
                        <Box sx={DesStyle}></Box>
                    </Box>
                </Box>
                <Box sx={DetailContainer}>
                    <Box sx={TabsContainer}>
                        <Tabs
                            sx={TabsBaseStyle}
                            value={checkedTab}
                            onChange={handleTabChange}
                        >
                            {menuList.map(({ title }) => (
                                <Tab
                                    sx={TabBaseStyle}
                                    key={title}
                                    label={title}
                                />
                            ))}
                        </Tabs>
                        {menuList.find((item, index) => index === checkedTab)!.comp}
                    </Box>
                    <Box sx={SiderContainer}>
                        <Box></Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const BaseContainerStyle = {
    background: '#fff',
    boxShadow: Shadow.Light,
    borderRadius: RoundCorner(1),
};

const MineContainer = {
    minHeight: '100%',
    padding: `${mineCenterContentTop}px 20px 20px`,
    backgroundColor: Palette.Fill.LightNormal,
};

const ContentContainer = {
    width: `${contentWidth}px`,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
};

const InfoContainer = {
    ...BaseContainerStyle,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    height: `${mineCenterInfoContentSize}px`,
    padding: '0 20px 20px'
};

const AvatarContainer = {
    width: `${mineCenterAvatarSize}px`,
    height: `${mineCenterAvatarSize}px`,
    boxSizing: 'content-box',
    border: '4px solid #fff',
    borderRadius: RoundCorner(2),
    overflow: 'hidden',
};

const InfoContent = {
    padding: '16px 32px 0',
};

const NameStyle = {
    ...Font.TitleHugeBold2,
    color: Palette.Text.Title,
};

const DesStyle = {
    ...Font.TitleLarge,
    color: Palette.Text.Text,
};

const DetailContainer = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `${contentTop}px`,
    flexGrow: 1,
};

const TabsContainer = {
    ...BaseContainerStyle,
    width: `${mineDetailContentWidth}px`,
};

const SiderContainer = {
    ...BaseContainerStyle,
    width: `${mineDetailSiderWidth}px`,
};