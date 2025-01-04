import { User } from "@user-management/domain/entities/user";
import { UuidNewUserFactory } from "./uuid-new-user.factory";
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('UuidNewUserFactory', () => {
  let factory: UuidNewUserFactory;

  beforeEach(() => {
    factory = new UuidNewUserFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with a UUID', () => {
      const mockUuid = 'generated-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
      const name = 'John Doe';
      const email = 'john@email.com';
      const password = '12345678';

      const actualUser = factory.create({
        name: name,
        email: email,
        password: password
      });

      const expectedUser = new User(
        mockUuid,
        name,
        email,
        password
      );
      expect(actualUser).toEqual(expectedUser);
    });
  });
});
