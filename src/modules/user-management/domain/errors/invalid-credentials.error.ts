export class InvalidCredentialsError extends Error {
  static readonly message = 'Invalid credentials';

  constructor() {
    super(InvalidCredentialsError.message);
    this.name = 'InvalidCredentialsError';
  }
}
