import axios, { AxiosError, AxiosInstance } from 'axios';
import _defaultsDeep from 'lodash-es/defaultsDeep';
import BBSError from '../base/error';
import { HTTPStatus } from '../base/http-utils';

export interface Options {
    timeout: number, // 超时，默认10秒
    historyDepth: number, // redo/undo缓存数量
}
const DefaultOptions: Options = {
    timeout: 10 * 1000,
    historyDepth: 10000000,
};

export interface ServerConfig {
    host: string,
    path?: string,
    port?: number,
    secure?: boolean,
}

export default class ServiceApi {
    protected readonly query: AxiosInstance;
    protected readonly options: Options;
    public constructor(
        {host, path = '/', port, secure}: ServerConfig,
        options: Partial<Options> = {},
    ) {
        this.options = _defaultsDeep(options, DefaultOptions);
        if(!path.startsWith('/')) path = '/' + path;
        if(!path.endsWith('/')) path = path + '/';
        const url = `${host}${port != null ? ':' + String(port) : ''}${path}`;
        this.query = axios.create({
            baseURL: `${
                secure ? 'https' : 'http'
            }://${url}`,
            responseType: 'json',
            timeout: this.options.timeout, // 默认超时
        });
    }

    protected async request<Response, Request>(
        path: string,
        request: Request,
        method: 'get' | 'post' = 'post'
    ): Promise<Response> {
        let response: Response;
        const requestData = request;
        try {
            ({data: response} = await this.query.request({
                url: path,
                method,
                ...(method === 'get' ? { params: requestData } : { data: requestData })
            }));
        } catch (err: unknown) {
            throw this.fromAxiosError(err as AxiosError);
        }
        return response;
    }

    protected fromAxiosError(err: AxiosError,): BBSError {
        if (err.response == null) {
            return new BBSError(ServiceApi.Error.Network, err.message);
        }

        if (err.response.status === HTTPStatus.Unauthorized) {
            return new BBSError(ServiceApi.Error.Internal, err.message);
        }

        if (err.response.status === HTTPStatus.NotExisted) {
            return new BBSError(ServiceApi.Error.NotExisted, err.message);
        } else if (err.response.status === HTTPStatus.AlreadyExisted) {
            return new BBSError(ServiceApi.Error.AlreadyExisted, err.message);
        } else if (err.response.status === HTTPStatus.Forbidden) {
            return new BBSError(ServiceApi.Error.Forbidden, err.message);
        } else if (err.response.status === HTTPStatus.Outdated) {
            return new BBSError(ServiceApi.Error.Outdated, err.message);
        } else { // 其他错误均按Internal处理，不做区分
            return new BBSError(ServiceApi.Error.Internal, err.message);
        }
    }

    public static readonly Error = {
        Network: 'service-api:network',
        NotExisted: 'service-api:not-existed',
        AlreadyExisted: 'service-api:already-existed',
        Forbidden: 'service-api:forbidden',
        Outdated: 'service-api:outdated',
        Internal: 'service-api:internal',
        NoPermission: 'service-api:no-permission',
    };
}