import ServiceApi, {ServerConfig} from './service/service-api';

const localServerConfig: ServerConfig = {
    host: window.location.hostname,
    port: 3000,
    path: '',
    secure: false,
};
const productServerConfig: ServerConfig = {
    host: '',
    port: 80,
    path: '',
    secure: true,
};

const serverConfig = __node_env__ === 'development' ? localServerConfig : productServerConfig;

export class AppController {
    protected readonly service: ServiceApi;
    public constructor() {
        this.service = new ServiceApi(serverConfig);
    }
}