
import { defHttp } from '../utils/http';
import { isDevelopment } from '../utils/util';
import { CheckerParams, IUserInfo, LoginParams, LoginResultModel, RegisterParams, ThirdLoginParams, UploadAuthParams, UploadParams } from './interface';
import { setAuthCache } from '../utils/auth';
import { TOKEN_KEY } from '../utils/cache/enum';

enum Api {
    Login = '/sys/login',
    getInputCode = '/sys/randomImage',
    Logout = '/sys/logout',
    GetUserInfo = '/sys/user/getUserInfo',
    //注册接口
    registerApi = '/sys/user/register',
    // 获取系统权限
    // 1、查询用户拥有的按钮/表单访问权限
    // 2、所有权限
    // 3、系统安全模式
    GetPermCode = '/sys/permission/getPermCode',
    //修改密码
    PasswordChange = '/sys/user/passwordChange',
    //校验用户接口
    checkOnlyUser = '/sys/user/checkOnlyUser',
    //第三方登录
    thirdLogin = '/sys/thirdLogin/getLoginUser',
    PositionList = '/sys/position/list',
    UserList = '/sys/user/list',
    RoleList = '/sys/role/list',
    QueryDepartTreeSync = '/sys/sysDepart/queryDepartTreeSync',
    QueryTreeList = '/sys/sysDepart/queryTreeList',
    GetTableList = '/sys/user/queryUserComponentData',
    GetUploadAuth = '/sys/upload/presignedUrl',
}

export const baseDomainUrl = isDevelopment ? 'http://localhost:8080/jeecg-system' : 'https://www.pifutan.com/jeecg-system';

/**
 * 上传父路径
 */
const uploadUrl = `${baseDomainUrl}/sys/common/upload`;

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
export const uploadFile = (params: any, success: any) => defHttp.uploadFile({ url: uploadUrl }, params, { success });
/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (url: string, fileName?: string, parameter?: any) => getFileblob(url, parameter).then((data) => {
    if (!data || data.size === 0) {
        return;
    }
    if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
        (window.navigator as any).msSaveBlob(new Blob([data]), fileName);
    } else {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName ?? '未命名文件');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
    }
});

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export const getFileblob = (url: string, parameter: any) => defHttp.get(
    {
        url: url,
        params: parameter,
        responseType: 'blob',
    },
    { isTransformResponse: false }
);

export const getUploadAuth = (params?: UploadAuthParams) => defHttp.get({ url: Api.GetUploadAuth, params });

export const uploadFileWithPut = (params: UploadParams) => defHttp.UploadFileWithPut(params);