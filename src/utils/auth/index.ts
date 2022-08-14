import { Persistent, BasicKeys } from '../cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '../cache/enum';
import projectSetting from '../../settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

/**
 * 获取token
 */
export function getToken() {
    return getAuthCache<string>(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
    const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
    return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value: any) {
    const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
    return fn(key, value, true);
}

/**
 * 设置动态key
 * @param key
 * @param value
 */
export function setCacheByDynKey(key: BasicKeys, value: any) {
    const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
    return fn(key, value, true);
}

/**
 * 获取动态key
 * @param key
 */
export function getCacheByDynKey<T>(key: BasicKeys) {
    const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
    return fn(key) as T;
}

/**
 * 移除动态key
 * @param key
 */
export function removeCacheByDynKey<T>(key: BasicKeys) {
    const fn = isLocal ? Persistent.removeLocal : Persistent.removeSession;
    return fn(key);
}
/**
 * 移除缓存中的某个属性
 * @param key
 * @update:移除缓存中的某个属性
 * @updateBy:lsq
 * @updateDate:2021-09-07
 */
export function removeAuthCache<T>(key: BasicKeys) {
    const fn = isLocal ? Persistent.removeLocal : Persistent.removeSession;
    return fn(key);
}

export function clearAuthCache(immediate = true) {
    const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
    return fn(immediate);
}
