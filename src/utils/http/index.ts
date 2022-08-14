/* eslint-disable @typescript-eslint/no-unused-expressions */

import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from './type';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { errMessageDict } from './constants';
import { ConfigEnum, ContentTypeEnum, RequestEnum, ResultEnum } from './enum';
import { useMessage } from '../../hooks/useMessage';
import { isString } from '../is';
import { getToken } from '../auth/index';
import { setObjToUrlParams, deepMerge } from '../util';
import signMd5Utils from '../signMd5Utils';
import { joinTimestamp, formatRequestDate } from './helper';
const urlPrefix = '';
const apiUrl = '/jeecg-boot';
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
        const { isTransformResponse, isReturnNativeResponse } = options;
        if (isReturnNativeResponse) {
            return res;
        }
        if (!isTransformResponse) {
            return res.data;
        }
        const { data } = res;
        if (!data) {
            throw new Error(errMessageDict.apiRequestFailed);
        }
        const { code, result, message, success } = data as any;
        const hasSuccess = data && success && Reflect.has(data, 'code') && (code === ResultEnum.SUCCESS || code === 200);
        if (hasSuccess) {
            if (message && options.successMessageMode === 'success') {
                //信息成功提示
                void createMessage.success(message);
            }
            return result;
        }
        let timeoutMsg = '';
        switch (code) {
            case ResultEnum.TIMEOUT:
                timeoutMsg = errMessageDict.timeoutMessage;
                break;
            default:
                if (message) {
                    timeoutMsg = message;
                }
        }

        // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
        if (options.errorMessageMode === 'modal') {
            createErrorModal({ title: errMessageDict.errorTip, content: timeoutMsg });
        } else if (options.errorMessageMode === 'message') {
            void createMessage.error(timeoutMsg);
        }

        throw new Error(timeoutMsg || errMessageDict.apiRequestFailed);
    },

    // 请求之前处理config
    beforeRequestHook: (config, options) => {
        const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

        if (joinPrefix) {
            config.url = `${urlPrefix}${config.url}`;
        }

        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;
        formatDate && data && !isString(data) && formatRequestDate(data);
        if (config.method?.toUpperCase() === RequestEnum.GET) {
        if (!isString(params)) {
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
            config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
        } else {
            // 兼容restful风格
            config.url = (config.url ?? '') + params + `${joinTimestamp(joinTime, true)}`;
            config.params = undefined;
        }
        } else {
        if (!isString(params)) {
            formatDate && formatRequestDate(params);
            if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
            config.data = data;
            config.params = params;
            } else {
            // 非GET请求如果没有提供data，则将params视为data
            config.data = params;
            config.params = undefined;
            }
            if (joinParamsToUrl) {
            config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
            }
        } else {
            // 兼容restful风格
            config.url = (config.url ?? '') + params;
            config.params = undefined;
        }
        }
        return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config: Recordable, options) => {
        // 请求之前处理config
        const token = getToken();
        if (token && config?.requestOptions?.withToken !== false) {
            // jwt token
            config.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
            config.headers[ConfigEnum.TOKEN] = token;
            config.headers[ConfigEnum.TIMESTAMP] = signMd5Utils.getTimestamp();
            config.headers[ConfigEnum.Sign] = signMd5Utils.getSign(config.url, config.params);
            config.headers[ConfigEnum.VERSION] = 'v3';
        }
        return config;
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res: AxiosResponse<any>) => res,

    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (error: any) => {
        const { response, code, message, config } = error || {};
        const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
        //scott 20211022 token失效提示信息
        //const msg: string = response?.data?.error?.message ?? '';
        const msg: string = response?.data?.message ?? '';
        const err: string = error?.toString?.() ?? '';
        let errMessage = '';

        try {
        if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
            errMessage = errMessageDict.apiTimeoutMessage;
        }
        if (err?.includes('Network Error')) {
            errMessage = errMessageDict.networkExceptionMsg;
        }

        if (errMessage) {
            if (errorMessageMode === 'modal') {
                createErrorModal({ title: errMessageDict.errorTip, content: errMessage });
            } else if (errorMessageMode === 'message') {
                void createMessage.error(errMessage);
            }
            return Promise.reject(error);
        }
        } catch (error: any) {
            throw new Error(error);
        }

        checkStatus(error?.response?.status, msg, errorMessageMode);
        return Promise.reject(error);
    },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
    return new VAxios(
        deepMerge(
        {
            // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
            // authentication schemes，e.g: Bearer
            // authenticationScheme: 'Bearer',
            authenticationScheme: '',
            timeout: 10 * 1000,
            // 基础接口地址
            headers: { 'Content-Type': ContentTypeEnum.JSON },
            // 如果是form-data格式
            // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
            // 数据处理方式
            transform,
            // 配置项，下面的选项都可以在独立的接口请求中覆盖
            requestOptions: {
                // 默认将prefix 添加到url
                joinPrefix: true,
                // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                isReturnNativeResponse: false,
                // 需要对返回数据进行处理
                isTransformResponse: true,
                // post请求的时候添加参数到url
                joinParamsToUrl: false,
                // 格式化提交参数时间
                formatDate: true,
                // 异常消息提示类型
                errorMessageMode: 'message',
                // 成功消息提示类型
                successMessageMode: 'success',
                // 接口地址
                apiUrl,
                // 接口拼接地址
                urlPrefix,
                //  是否加入时间戳
                joinTime: true,
                // 忽略重复请求
                ignoreCancelToken: true,
                // 是否携带token
                withToken: true,
            },
        },
        opt || {}
        )
    );
}
export const defHttp = createAxios();
