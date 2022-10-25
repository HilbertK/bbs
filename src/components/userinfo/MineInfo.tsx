import { Box, Button, Tab, Tabs } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneIcon from '@mui/icons-material/StayCurrentPortrait';
import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import { Font, Palette, RoundCorner, Shadow } from '../../base/style';
import { Avatar } from '../avatar/Avatar';
import { BaseButtonStyle, contentTop, contentWidth, TabBaseStyle, TabsBaseStyle } from '../../ui/base-utils';
import { Page, SexDict, SexEnum } from '../../utils/constants';
import { MineArticles } from './MineArticles';
import { mineCenterAvatarSize, mineDetailContentWidth, mineDetailSiderWidth } from './constants';
import { IUserInfo } from '../../service/interface';

interface InfoItem {
    key: string,
    iconComp: JSX.Element,
    renderViewer?: (value: any) => JSX.Element | string,
}

const showInfoNum = 2;

export const MineInfo: FC<{
    userInfo: IUserInfo,
}> = props => {
    const { userInfo } = props;
    const [showNum, setShowNum] = useState<number>(showInfoNum);
    const [checkedTab, setCheckedTab] = useState<number>(0);
    if (userInfo === null) return null;
    const navigate = useNavigate();
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCheckedTab(newValue);
    };
    const onEditHandler = () => {
        navigate(`/${Page.Setting}`);
    };
    const toggleMore = () => setShowNum(prev => prev === infoList.length ? showInfoNum : infoList.length);
    const infoList: Array<InfoItem> = useMemo(() => [{
        key: 'phone',
        iconComp: <PhoneIcon />,
    }, {
        key: 'email',
        iconComp: <EmailIcon />,
    }, {
        key: 'birthday',
        iconComp: <CakeIcon />,
    }, {
        key: 'sex',
        iconComp: <WcIcon />,
        renderViewer: (value: any) => SexDict[value as SexEnum],
    }].filter(({ key }) => userInfo[key as keyof IUserInfo]), [userInfo]);
    const menuList = useMemo(() => [{
        title: '文章',
        comp: <MineArticles filters={{ author: [userInfo.username] }} />
    }, {
        title: '收藏',
        comp: <MineArticles filters={{ collect: [true] }} />
    }, {
        title: '学习'
    }], [userInfo]);
    return (
        <Box sx={ContentContainer}>
            <Box sx={InfoContainer}>
                <Box sx={AvatarContainerStyle}>
                    <Avatar
                        url={userInfo.avatar}
                        name={userInfo.realname}
                        size={mineCenterAvatarSize}
                        isRound={false}
                    />
                </Box>
                <Box sx={InfoContent}>
                    <Box sx={NameStyle}>{userInfo.realname}</Box>
                    <Box sx={{
                        height: `${32 * showNum}px`,
                        transition: 'height ease .5s',
                        overflow: 'hidden'
                    }}>
                        {infoList.map(({ key, iconComp, renderViewer = (value: any) => value }, index) => (
                            <Box key={key} sx={{
                                ...InfoItemStyle,
                                opacity: index >= showNum ? 0 : 1,
                            }}>
                                {iconComp}
                                <Box sx={TextContentStyle}>{renderViewer(userInfo[key as keyof IUserInfo])}</Box>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={FooterStyle}>
                        {infoList.length > showInfoNum && <Box sx={DetailButtonStyle} onClick={toggleMore}>
                            查看详细资料
                            <KeyboardArrowDownIcon
                                sx={{
                                    ...ArrowStyle,
                                    ...(showNum >= infoList.length ? RotateArrowStyle : {})
                                }}
                            />
                        </Box>}
                        <Button
                            variant='outlined'
                            sx={BaseButtonStyle}
                            onClick={onEditHandler}
                        >编辑个人资料</Button>
                    </Box>
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
                    {Boolean(userInfo.appearance) &&
                        <Box component='img' src={userInfo.appearance} sx={AppearanceStyle} />
                    }
                    {Boolean(userInfo.description) &&
                        <Box sx={DescriptionStyle}>{userInfo.description}</Box>
                    }
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
    padding: '0 20px 20px'
};

export const AvatarContainerStyle = {
    width: `${mineCenterAvatarSize}px`,
    height: `${mineCenterAvatarSize}px`,
    marginTop: '-20px',
    boxSizing: 'content-box',
    border: '4px solid #fff',
    boxShadow: Shadow.Light,
    borderRadius: RoundCorner(2),
    overflow: 'hidden',
    flexShrink: 0,
};

const InfoContent = {
    padding: '16px 32px 0',
    width: '100%',
};

const NameStyle = {
    ...Font.TitleHugeBold2,
    color: Palette.Text.Title,
};

const InfoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    color: Palette.Text.Asider,
    transition: 'opacity ease .5s',
    marginTop: '10px',
    '& .MuiSvgIcon-root': {
        fontSize: Font.TitleMedium,
    }
};

const TextContentStyle = {
    ...Font.TextMedium,
    marginLeft: '10px',
};

const FooterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px'
};

const DetailContainer = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `${contentTop}px`,
    flexGrow: 1,
};

const DetailButtonStyle = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: Palette.Fill.Weaken,
    '&:hover': {
        color: Palette.Fill.Normal,
    },
};

const ArrowStyle = {
    transition: 'transform ease .3s',
};

const RotateArrowStyle = {
    transform: 'rotate(180deg)',
};

const TabsContainer = {
    ...BaseContainerStyle,
    width: `${mineDetailContentWidth}px`,
};

const SiderContainer = {
    ...BaseContainerStyle,
    width: `${mineDetailSiderWidth}px`,
    padding: '32px'
};

const AppearanceStyle = {
    width: '100%',
    height: 'auto'
};

const DescriptionStyle = {
    ...Font.TitleLarge,
    color: Palette.Fill.Emphasize,
    marginTop: '10px'
};