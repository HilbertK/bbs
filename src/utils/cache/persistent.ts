/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createLocalStorage, createSessionStorage } from './index';
import { Memory } from './memory';
import {
    TOKEN_KEY,
    USER_INFO_KEY,
    ROLES_KEY,
    APP_LOCAL_CACHE_KEY,
    APP_SESSION_CACHE_KEY,
    DB_DICT_DATA_KEY,
} from './enum';
import { DEFAULT_CACHE_TIME } from '../../settings/encryptionSetting';
import pick from 'lodash-es/pick';
import { IUserInfo } from '../../service/interface';

interface BasicStore {
    [TOKEN_KEY]: string | number | null | undefined,
    [USER_INFO_KEY]: IUserInfo,
    [ROLES_KEY]: string[],
    [DB_DICT_DATA_KEY]: string,
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

function initPersistentMemory() {
    const localCache = ls.get(APP_LOCAL_CACHE_KEY);
    const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
    localCache && localMemory.resetCache(localCache);
    sessionCache && sessionMemory.resetCache(sessionCache);
}

export class Persistent {
    static getLocal<T>(key: LocalKeys) {
        return localMemory.get(key)?.value as Nullable<T>;
    }

    static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
        localMemory.set(key, value);
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }

    static removeLocal(key: LocalKeys, immediate = false): void {
        localMemory.remove(key);
        immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
    }

    static clearLocal(immediate = false): void {
        localMemory.clear();
        immediate && ls.clear();
    }

    static getSession<T>(key: SessionKeys) {
        return sessionMemory.get(key)?.value as Nullable<T>;
    }

    static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
        sessionMemory.set(key, value);
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }

    static removeSession(key: SessionKeys, immediate = false): void {
        sessionMemory.remove(key);
        immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
    }
    static clearSession(immediate = false): void {
        sessionMemory.clear();
        immediate && ss.clear();
    }

    static clearAll(immediate = false) {
        sessionMemory.clear();
        localMemory.clear();
        if (immediate) {
        ls.clear();
        ss.clear();
        }
    }
}

window.addEventListener('beforeunload', () => {
    ss.set(APP_SESSION_CACHE_KEY, {
        ...sessionMemory.getCache,
        ...pick(ss.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY]),
    });
});

function storageChange(e: any) {
    const { key, newValue, oldValue } = e;

    if (!key) {
        Persistent.clearAll();
        return;
    }

    if (!!newValue && !!oldValue) {
        if (APP_LOCAL_CACHE_KEY === key) {
            Persistent.clearLocal();
        }
        if (APP_SESSION_CACHE_KEY === key) {
            Persistent.clearSession();
        }
    }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();
