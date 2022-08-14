import type { ErrorMessageMode } from './type';
import { useMessage } from '../../hooks/useMessage';
import { errMessageDict } from './constants';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error;

export function checkStatus(status: number, msg: string, errorMessageMode: ErrorMessageMode = 'message'): void {
    let errMessage = '';
    switch (status) {
        case 400:
            errMessage = `${msg}`;
            break;
        case 401:
            errMessage = errMessageDict.errMsg401;
            break;
        case 403:
            errMessage = errMessageDict.errMsg403;
            break;
        // 404请求不存在
        case 404:
            errMessage = errMessageDict.errMsg404;
            break;
        case 405:
            errMessage = errMessageDict.errMsg405;
            break;
        case 408:
            errMessage = errMessageDict.errMsg408;
            break;
        case 500:
            errMessage = errMessageDict.errMsg500;
            break;
        case 501:
            errMessage = errMessageDict.errMsg501;
            break;
        case 502:
            errMessage = errMessageDict.errMsg502;
            break;
        case 503:
            errMessage = errMessageDict.errMsg503;
            break;
        case 504:
            errMessage = errMessageDict.errMsg504;
            break;
        case 505:
            errMessage = errMessageDict.errMsg505;
            break;
        default:
    }

    if (errMessage) {
        if (errorMessageMode === 'modal') {
            createErrorModal({ title: errMessageDict.errorTip, content: errMessage });
        } else if (errorMessageMode === 'message') {
            void error({ content: errMessage, key: `global_error_message_status_${status}` });
        }
    }
}
