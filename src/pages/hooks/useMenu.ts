import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { actions, subMenuDict, SubMenuEnum, TopMenu } from '../../store/menu-slice';
import { Page } from '../../utils/constants';

export const useMenu = (subMenu: SubMenuEnum | null, topMenu: TopMenu | null) => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const userRoles = useSelector((state: RootState) => state.user.userRoles);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const setDefaultMenu = () => {
            // TODO: 暂时跳个人中心
            navigate(`/${Page.Mine}`);
        };
        const subMenuItem = subMenu ? subMenuDict[subMenu] : null;
        if (!subMenuItem) return;
        const checkTopMenu = () => {
            const topMenuItem = topMenu ? (subMenuItem.children ?? {})[topMenu] : null;
            if (!topMenuItem) {
                dispatch(actions.setTopSubMenu(null));
                return;
            }
            if (topMenuItem.checkFn) {
                if (topMenuItem.checkFn(userRoles, userInfo)) {
                    dispatch(actions.setTopSubMenu(topMenu));
                } else {
                    setDefaultMenu();
                }
            } else {
                dispatch(actions.setTopSubMenu(topMenu));
            }
        };
        if (subMenuItem.checkFn) {
            if (subMenuItem.checkFn(userRoles, userInfo)) {
                dispatch(actions.setCurrSubMenu(subMenu));
                checkTopMenu();
            } else {
                setDefaultMenu();
            }
        } else {
            dispatch(actions.setCurrSubMenu(subMenu));
            checkTopMenu();
        }
    }, [userInfo, userRoles, subMenu, topMenu]);
};