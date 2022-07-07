export default class BBSError extends Error {
    public static is(error: unknown): error is BBSError {
        return error instanceof Error
            && error.name === 'BBSError';
    }
    public constructor(
        public readonly code: string,
        message: string = code,
    ) {
        super(message);
        this.name = 'BBSError';
    }
}