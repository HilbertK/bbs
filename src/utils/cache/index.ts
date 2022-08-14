import { getStorageShortName } from '../env';
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '../../settings/encryptionSetting';

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => ({
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options,
});

export const WebStorage = create(createOptions(sessionStorage));

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => create(createOptions(storage, options));

export const createSessionStorage = (options: Options = {}) => createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME });

export const createLocalStorage = (options: Options = {}) => createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });

export default WebStorage;
