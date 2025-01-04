import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserController } from './register-user.controller';
import { RegisterUserService } from '@user-management/application/register-user/register-user.service';
import { RegisterUserRequestDto } from '../dtos/register-user-request.dto';
import { BadRequestException } from '@nestjs/common';

describe('RegisterUserController', () => {
  let controller: RegisterUserController;
  let registerUserService: RegisterUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterUserController],
      providers: [
        {
          provide: RegisterUserService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RegisterUserController>(RegisterUserController);
    registerUserService = module.get<RegisterUserService>(RegisterUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should successfully register a user', async () => {
      const dto: RegisterUserRequestDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = { id: 'uuid123' }; // This is what the service should return

      // Mocking the service method call
      jest.spyOn(registerUserService, 'execute').mockResolvedValue(response);

      const result = await controller.handle(dto);

      expect(result).toEqual(response);
      expect(registerUserService.execute).toHaveBeenCalledWith(dto);
      expect(registerUserService.execute).toHaveBeenCalledTimes(1);
    });

    it('should handle validation errors', async () => {
      const dto: RegisterUserRequestDto = {
        name: '', // Invalid name
        email: 'invalid-email',
        password: 'password123',
      };

      // Simulate validation error
      try {
        await controller.handle(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should handle errors thrown by the service', async () => {
      const dto: RegisterUserRequestDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mocking the service to throw an error
      jest.spyOn(registerUserService, 'execute').mockRejectedValue(new Error('Service error'));

      await expect(controller.handle(dto)).rejects.toThrow('Service error');
    });
  });
});
