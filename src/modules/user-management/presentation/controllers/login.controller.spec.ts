import { Test, TestingModule } from '@nestjs/testing';
import {
  ValidationPipe,
  BadRequestException,
  ArgumentMetadata,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from '../../application/login/login.service';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { LoginRequestDTO } from '../dtos/login-request.dto';
import { mock, instance } from 'ts-mockito';

describe('LoginController', () => {
  let controller: LoginController;
  let loginService: jest.Mocked<LoginService>;

  beforeEach(async () => {
    const mockLoginService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(
      LoginService,
    ) as jest.Mocked<LoginService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should return LoginResponseDTO on success', async () => {
      const validDto = { email: 'johndoe@gmail.com', password: 'Password1!' };
      const mockResponse = {
        access: {
          token: 'access-token',
          expiresIn: 600,
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: 3600,
        },
        user: {
          id: '123',
          name: 'John Doe',
          email: 'johndoe@gmail.com',
        },
      };

      loginService.execute.mockResolvedValue(mockResponse);

      const result = await controller.handle(validDto);

      expect(result).toEqual(mockResponse);
      expect(loginService.execute).toHaveBeenCalledWith(validDto);
    });

    it('should throw InvalidCredentialsError if login fails', async () => {
      const invalidDto: LoginRequestDTO = {
        email: 'johndoe@gmail.com',
        password: 'WrongPassword!',
      };

      loginService.execute.mockRejectedValue(new InvalidCredentialsError());

      await expect(controller.handle(invalidDto)).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if DTO validation fails', async () => {
      const invalidDto: Partial<LoginRequestDTO> = {
        email: 'invalid-email',
      }; // Missing password

      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      // Mocking ArgumentMetadata with ts-mockito
      const metadata = mock<ArgumentMetadata>();

      await expect(
        validationPipe.transform(invalidDto, instance(metadata)),
      ).rejects.toThrow(BadRequestException);
      expect(loginService.execute).not.toHaveBeenCalled();
    });

    it('should not call LoginService if DTO is incomplete', async () => {
      const incompleteDto: Partial<LoginRequestDTO> = {
        email: 'johndoe@gmail.com',
      }; // Missing password

      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      // Mocking ArgumentMetadata with ts-mockito
      const metadata = mock<ArgumentMetadata>();

      await expect(
        validationPipe.transform(incompleteDto, instance(metadata)),
      ).rejects.toThrow(BadRequestException);
      expect(loginService.execute).not.toHaveBeenCalled();
    });
  });
});

