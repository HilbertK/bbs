import { isDevelopment } from '../../utils/util';

export const subPathKey = 'id';

const subBasePath = __sub_path__ !== '' ? `/${__sub_path__}` : '';

export const baseUrl = isDevelopment ?
    `${window.location.protocol}//localhost:3100`
    : `${window.location.protocol}//${window.location.host}${subBasePath}`;
export const userSystemPath = '/system/user';
export const roleSystemPath = '/system/role';

export enum SubPathValue {
    User = 'user',
    Role = 'role',
}

export const subPathDict = {
    [SubPathValue.User]: userSystemPath,
    [SubPathValue.Role]: roleSystemPath
};