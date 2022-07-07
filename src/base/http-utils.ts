export enum HTTPStatus {
    Succeeded = 200,
    Partial = 206, // 请求文件时允许范围部分内容
    MissingParams = 400,
    Unauthorized = 401, // sessionId错误
    Forbidden = 403, // 禁止访问
    NotExisted = 404,
    Outdated = 408, // 数据在请求期间更改
    AlreadyExisted = 409,
    TooFrequent = 429,
    Failed = 412,
    RangeIncorrect = 416, // 请求中范围出错
    Mismatch = 433, // 用户名密码错
    Internal = 500, // 服务器错误
}