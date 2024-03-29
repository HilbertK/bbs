
import { defHttp, defHttpWithNoTimeout } from '../utils/http';
import { isDevelopment, isTest } from '../utils/util';
import { CheckerParams, IUserInfo, LoginParams, LoginResultModel, RegisterParams, ThirdLoginParams, UploadAuthParams, UploadParams } from './interface';
import { setAuthCache } from '../utils/auth';
import { TOKEN_KEY } from '../utils/cache/enum';
import axios from 'axios';
import { notification } from 'antd';

enum Api {
    Login = '/jeecg-system/sys/login',
    getInputCode = '/jeecg-system/sys/randomImage',
    Logout = '/jeecg-system/sys/logout',
    GetUserInfo = '/jeecg-system/sys/user/getUserInfo',
    //注册接口
    registerApi = '/jeecg-system/sys/user/register',
    // 获取系统权限
    // 1、查询用户拥有的按钮/表单访问权限
    // 2、所有权限
    // 3、系统安全模式
    GetPermCode = '/jeecg-system/sys/permission/getPermCode',
    //修改密码
    PasswordChange = '/jeecg-system/sys/user/passwordChange',
    //校验用户接口
    checkOnlyUser = '/jeecg-system/sys/user/checkOnlyUser',
    //第三方登录
    thirdLogin = '/jeecg-system/sys/thirdLogin/getLoginUser',
    PositionList = '/jeecg-system/sys/position/list',
    UserList = '/jeecg-system/sys/user/list',
    RoleList = '/jeecg-system/sys/role/list',
    getUserRole = '/jeecg-system/sys/user/queryUserRole',
    allRolesList = '/jeecg-system/sys/role/queryall',
    QueryDepartTreeSync = '/jeecg-system/sys/sysDepart/queryDepartTreeSync',
    QueryTreeList = '/jeecg-system/sys/sysDepart/queryTreeList',
    GetTableList = '/jeecg-system/sys/user/queryUserComponentData',
    GetUploadAuth = '/jeecg-system/sys/upload/presignedUrl',
    // 用户相关
    EditUserInfo = '/jeecg-system/sys/user/appEdit',
}

export const baseDomain = isDevelopment ? 'http://localhost:8080' : (isTest ? 'https://www.pifutan.com' : 'http://zhzw.zhongwenlaw.com');

/**
 * 上传父路径
 */
const uploadUrl = `${baseDomain}/jeecg-system/sys/common/upload`;

export function doLogout() {
    return defHttp.get({ url: Api.Logout });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
    return defHttp.post<LoginResultModel>({ url: Api.Login, params });
}

/**
 * @description: 注册接口
 */
export function register(params: RegisterParams) {
    return defHttp.post({ url: Api.registerApi, params });
}

/**
 *校验用户是否存在
 * @param params
 */
export const checkOnlyUser = (params: CheckerParams) => defHttp.get({ url: Api.checkOnlyUser, params }, { isTransformResponse: false });

export function getCodeInfo(currdatetime: number) {
    let url = Api.getInputCode + `/${currdatetime}`;
    return defHttp.get({ url: url });
}

/**
 * @description: 第三方登录
 */
export function thirdLogin(params: ThirdLoginParams) {
    return defHttp.get<LoginResultModel>({url: `${Api.thirdLogin}/${params.token}/${params.thirdType}`});
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
    return defHttp.get<IUserInfo>({ url: Api.GetUserInfo }).catch((e) => {
        if (e && (e.message.includes('timeout') || e.message.includes('401'))) {
            setAuthCache(TOKEN_KEY, null);
            // TODO: 跳回登录页
        }
    });
}

/**
 * 用户角色接口
 * @param params
 */
export const getUserRoles = (params: any) => defHttp.get({ url: Api.getUserRole, params }, { errorMessageMode: 'none' });

/**
 * 职务列表
 * @param params
 */
export const getPositionList = (params: any) => defHttp.get({ url: Api.PositionList, params });

/**
 * 用户列表
 * @param params
 */
export const getUserList = (params: any) => defHttp.get({ url: Api.UserList, params });

/**
 * 角色列表
 * @param params
 */
export const getRoleList = (params: any) => defHttp.get({ url: Api.RoleList, params });
/**
 * 获取全部角色
 * @param params
 */
export const getAllRolesList = (params: any) => defHttp.get({ url: Api.allRolesList, params });
/**
 * 异步获取部门树列表
 */
export const queryDepartTreeSync = (params?: any) => defHttp.get({ url: Api.QueryDepartTreeSync, params });
/**
 * 获取部门树列表
 */
export const queryTreeList = (params?: any) => defHttp.get({ url: Api.QueryTreeList, params });
/**
 * 部门用户modal选择列表加载list
 */
export const getTableList = (params: any) => defHttp.get({ url: Api.GetTableList, params });
/**
 * 文件上传
 */
export const uploadFile = (params: any, success: any) => defHttpWithNoTimeout.uploadFile({ url: uploadUrl }, params, { success });
/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (
    url: string,
    onProgress: (event: any) => void,
    onLoaded: () => void,
    fileName?: string
) => getFileblob(url, onProgress).then(res => {
    if (!res) return;
    const { data } = res;
    if (!data || data.size === 0) {
        notification.error({ message: '下载失败' });
        return;
    }
    const newUrl = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = newUrl;
    link.setAttribute('download', fileName ?? '未命名文件');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(newUrl); //释放掉blob对象
    onLoaded();
});

/**
 * 下载文件
 * @param url
 * @param parameter
 * @returns {*}
 */
export const getFileblob = (
    url: string,
    onProgress: (event: any) => void,
) => axios(
    {
        method: 'get',
        url: url,
        responseType: 'arraybuffer',
        onDownloadProgress: onProgress
    }
);

export const download = (
    url: string,
    fileName: string,
    onProgress: (loaded: number, total: number) => void,
    onLoaded: () => void
) => {
    const xhr = new XMLHttpRequest();
    xhr.onprogress = event => { // 下载进度事件
        onProgress(event.loaded, event.total);
    };

    xhr.onload = event => {
      if (xhr.readyState === 4 && xhr.status === 200) { // 下载完成之后
            const blob = new Blob([xhr.response]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
            onLoaded();
        }
    };

    xhr.open('GET', url);
    xhr.send();
};

export const getUploadAuth = (params?: UploadAuthParams) => defHttp.get({ url: Api.GetUploadAuth, params });

export const uploadFileWithPut = (params: UploadParams) => defHttpWithNoTimeout.UploadFileWithPut(params);

export const updateUserInfo =
    (params: Partial<IUserInfo> & { id: string | number }) => defHttp.post({ url: Api.EditUserInfo, params });