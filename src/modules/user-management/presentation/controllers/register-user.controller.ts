import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserResponseDto } from "../dtos/register-user-response.dto";
import {
  RegisterUserService
} from "@user-management/application/register-user/register-user.service";
import { RegisterUserRequestDto } from "../dtos/register-user-request.dto";

@Controller('users')
export class RegisterUserController {
  constructor(
    private readonly registerUserService: RegisterUserService
  ) {}

  @Post()
  async handle(@Body() dto: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    return await this.registerUserService.execute(dto);
  }
}
