import * as bcrypt from 'bcryptjs';

import { BCryptPasswordComparer } from "./bcrypt-password.comparer";

describe('BCryptPasswordComparer', () => {
  const passwordComparer = new BCryptPasswordComparer();

  describe('compare', () => {
    it('should return true when password is correct', async () => {
      // Arrange
      const plainTextPassword = '12345678';
      const encryptedPassword = await bcrypt.hash(plainTextPassword, 10);
      const input = { plainTextPassword, encryptedPassword };

      // Act
      const result = await passwordComparer.compare(input);
      
      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when password is incorrect', async () => {
      // Arrange
      const plainTextPassword = '12345678';
      const encryptedPassword = await bcrypt.hash('wrongpassword', 10);
      const input = { plainTextPassword, encryptedPassword };

      // Act
      const result = await passwordComparer.compare(input);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
