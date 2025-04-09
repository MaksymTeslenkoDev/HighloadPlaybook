export enum APP_ERROR_CODES {
  SystemError = '000',
  ClientError = '001',
  ValidationError = '002',
  NotFound = '003',
}

export class ServerError extends Error {
  constructor(
    public message: string,
    public code: APP_ERROR_CODES = APP_ERROR_CODES.ClientError,
    public systemCode: number = 400,
  ) {
    super();
    this.code;
  }
}
