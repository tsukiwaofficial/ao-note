export class AoNoteError extends Error {
  constructor(
    public message: string,
    public error?: string | number,
  ) {
    super(message);
    Object.setPrototypeOf(this, AoNoteError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
