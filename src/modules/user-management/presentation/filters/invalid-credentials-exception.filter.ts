import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import {
  InvalidCredentialsError
} from '../../domain/errors/invalid-credentials.error';

@Catch(InvalidCredentialsError)
export class InvalidCredentialsExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.UNAUTHORIZED;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
