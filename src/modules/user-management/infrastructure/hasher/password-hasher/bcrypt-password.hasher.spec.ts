import * as bcrypt from 'bcryptjs';

import { BCryptPasswordHasher } from './bcrypt-password.hasher';

describe("BCryptPasswordHasher", () => {
  let passwordHasher: BCryptPasswordHasher;

  beforeAll(() => {
    passwordHasher = new BCryptPasswordHasher();
  });

  describe("hash", () => {
    it("should return a hashed password", async () => {
      const password = "password";

      const hashedPassword = await passwordHasher.hash(password);

      expect(hashedPassword).not.toBe(password);
      const isMatch = bcrypt.compare(password, hashedPassword);
      expect(isMatch).resolves.toBe(true);
    });

    it('should produce different hashes for the same password due to salting', async () => {
      // Arrange
      const plainPassword = 'SecurePassword123';

      // Act
      const hashedPassword1 = await passwordHasher.hash(plainPassword);
      const hashedPassword2 = await passwordHasher.hash(plainPassword);

      // Assert
      expect(hashedPassword1).not.toBe(hashedPassword2); // Ensure salting produces different hashes
    });
  });
});
