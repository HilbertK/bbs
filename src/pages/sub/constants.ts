import { isDevelopment } from '../../utils/util';

export const subPathKey = 'id';

const subBasePath = __sub_path__ !== '' ? `/${__sub_path__}` : '';

export const baseUrl = isDevelopment ?
    `${window.location.protocol}//localhost:3100`
    : `${window.location.protocol}//${window.location.host}${subBasePath}`;

export enum SubPathValue {
    User = 'user',
    Role = 'role',
    AllFlows = 'allFlows',
    Tipoff = 'tipoff',
    CreateFlows = 'createFlows',
    HandleFlows = 'handleFlows'
}

export const subPathDict = {
    [SubPathValue.User]: '/system/user',
    [SubPathValue.Role]: '/system/role',
    [SubPathValue.AllFlows]: '/system/flow',
    [SubPathValue.Tipoff]: '/system/flow/tipoff',
    [SubPathValue.CreateFlows]: '/system/flow?create=1',
    [SubPathValue.HandleFlows]: '/system/flow?handle=1',
};