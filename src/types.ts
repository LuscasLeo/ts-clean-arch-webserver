export class HttpError {
  constructor(public readonly status: number, public readonly message: string) {}
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}
export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

