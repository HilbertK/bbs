import pkg from '../../package.json';

export const appShortName = 'zw_service';

export function getCommonStoragePrefix() {
    return `${appShortName}__${__node_env__}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
    return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}