import { mock, instance, when, verify, deepEqual } from "ts-mockito";
import { RegisterUserService } from "./register-user.service";
import { UserRepository } from "@user-management/domain/ports/user.repository";
import { NewUserFactory } from "@user-management/domain/ports/new-user.factory";
import { User } from "@user-management/domain/entities/user";
import { PasswordHasher } from "@user-management/domain/ports/password.hasher";

describe('RegisterUserService', () => {
  let userRepository: UserRepository;
  let newUserFactory: NewUserFactory;
  let passwordHasher: PasswordHasher;
  let service: RegisterUserService;

  beforeEach(() => {
    userRepository = mock<UserRepository>();
    newUserFactory = mock<NewUserFactory>();
    passwordHasher = mock<PasswordHasher>();
    service = new RegisterUserService(
      instance(userRepository),
      instance(newUserFactory),
      instance(passwordHasher)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should register a new user', async () => {
      const user = new User(
        'uuid', // Ensure ID is set here
        'John Doe',
        'john@email.com',
        'hashedPassword' // Hashed password to test the method
      );
      const input = {
        name: user.name,
        email: user.email,
        password: '12345678'
      };

      when(newUserFactory.create(deepEqual({
        name: input.name,
        email: input.email,
        password: user.password
      }))).thenReturn(user); // Correctly mock creation
      when(userRepository.save(user)).thenResolve(); // Mock save method
      when(passwordHasher.hash(input.password)).thenResolve('hashedPassword'); // Mock password hashing

      await service.execute(input);

      verify(newUserFactory.create(deepEqual({
        name: input.name,
        email: input.email,
        password: user.password
      }))).once();
      verify(userRepository.save(user)).once();
    });

    it('should return the user id', async () => {
      const user = new User(
        'uuid',
        'John Doe',
        'john@email.com',
        'hashedPassword'
      );
      const input = {
        name: user.name,
        email: user.email,
        password: '12345678'
      };

      when(newUserFactory.create(deepEqual({
        name: input.name,
        email: input.email,
        password: user.password
      }))).thenReturn(user);
      when(userRepository.save(user)).thenResolve();
      when(passwordHasher.hash(input.password)).thenResolve('hashedPassword');

      const result = await service.execute(input);

      const expectedResult = { id: user.id };
      expect(result).toEqual(expectedResult);
    });

    it('should throw error', async () => {
      const user = new User(
        'uuid',
        'John Doe',
        'john@email.com',
        'hashedPassword'
      );
      const input = {
        name: user.name,
        email: user.email,
        password: '12345678'
      };

      when(newUserFactory.create(deepEqual({
        name: input.name,
        email: input.email,
        password: user.password
      }))).thenReturn(user);
      when(passwordHasher.hash(input.password)).thenResolve('hashedPassword');
      when(userRepository.save(user)).thenReject(new Error('Error'));

      await expect(service.execute(input)).rejects.toThrow('Error');
    });
  });
});
