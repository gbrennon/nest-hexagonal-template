import { UserRepository } from "@user-management/domain/ports/user.repository";
import { LoginService } from "./login.service";
import { PasswordComparer } from "@user-management/domain/ports/password.comparer";
import { TokenGenerator } from "@user-management/domain/ports/token.generator";
import { instance, mock, when, deepEqual } from "ts-mockito";
import { User } from "@user-management/domain/entities/user";
import { InvalidCredentialsError } from "@user-management/domain/errors/invalid-credentials.error";

describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: UserRepository;
  let passwordComparer: PasswordComparer;
  let accessTokenGenerator: TokenGenerator;
  let refreshTokenGenerator: TokenGenerator;
  const user = new User(
    '1',
    'John Doe',
    'john@email.com',
    'hashed-password'
  );


  beforeEach(() => {
    userRepository = mock<UserRepository>();
    passwordComparer = mock<PasswordComparer>();
    accessTokenGenerator = mock<TokenGenerator>();
    refreshTokenGenerator = mock<TokenGenerator>();

    loginService = new LoginService(
      instance(userRepository),
      instance(passwordComparer),
      instance(accessTokenGenerator),
      instance(refreshTokenGenerator)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('when i successfull should return LoginOutput', async () => {
      const loginInput = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(user);
      when(passwordComparer.compare(deepEqual({
        plainTextPassword: loginInput.password,
        encryptedPassword: user.password
      }))).thenResolve(true);
      when(accessTokenGenerator.generate(user.id)).thenReturn({
        token: 'access-token',
        expiresIn: 600
      });
      when(refreshTokenGenerator.generate(user.id)).thenReturn({
        token: 'refresh-token',
        expiresIn: 3600
      });

      const loginOutput = await loginService.execute(loginInput);

      expect(loginOutput.access).toBeDefined();
      expect(loginOutput.refresh).toBeDefined();
      expect(loginOutput.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email
      });
    });

    it('should throw an error when user is not found', async () => {
      const input = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(null);

      await expect(
        loginService.execute(input)
      ).rejects.toThrow(new InvalidCredentialsError());
    });

    it('should throw an error when password is incorrect', async () => {
      const input = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(user);
      when(passwordComparer.compare(deepEqual({
        plainTextPassword: input.password,
        encryptedPassword: user.password
      }))).thenResolve(false);

      await expect(
        loginService.execute(input)
      ).rejects.toThrow(new InvalidCredentialsError());
    });
  });
});
