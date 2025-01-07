import { Body, Controller, HttpException, HttpStatus, Post, UseFilters } from "@nestjs/common";
import { LoginRequestDTO } from "../dtos/login-request.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";
import { LoginService } from "@user-management/application/login/login.service";
import { InvalidCredentialsExceptionFilter } from "../filters/invalid-credentials-exception.filter";
import { InvalidCredentialsError } from "@user-management/domain/errors/invalid-credentials.error";

@Controller('/login')
@UseFilters(InvalidCredentialsExceptionFilter)
export class LoginController {
  constructor(
    private readonly loginService: LoginService
  ) {}

  @Post()
  async handle(
    @Body() dto: LoginRequestDTO
  ): Promise<LoginResponseDTO | undefined> {
    try {
      return await this.loginService.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
