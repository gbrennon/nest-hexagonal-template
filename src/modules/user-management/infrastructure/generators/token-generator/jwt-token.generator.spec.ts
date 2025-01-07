import * as jwt from "jsonwebtoken";
import { JwtTokenGenerator } from "./jwt-token.generator";
import { TokenDTO } from "@user-management/domain/ports/token.generator";

describe("JwtTokenGenerator Integration Tests", () => {
  const secret = "test-secret"; // A strong secret should be used in production
  const expiresIn = 3600; // 1 hour in seconds
  let tokenGenerator: JwtTokenGenerator;

  beforeAll(() => {
    tokenGenerator = new JwtTokenGenerator(secret, expiresIn);
  });

  it("should generate a valid JWT with the correct payload and expiration", () => {
    const userId = "test-user-id";

    // Generate the token
    const tokenDTO: TokenDTO = tokenGenerator.generate(userId);

    // Validate the tokenDTO structure
    expect(tokenDTO).toHaveProperty("token");
    expect(tokenDTO).toHaveProperty("expiresIn", expiresIn);

    // Verify and decode the JWT
    const decoded = jwt.verify(tokenDTO.token, secret) as { id: string; exp: number };
    expect(decoded.id).toBe(userId);

    // Validate the expiration timestamp
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    expect(decoded.exp).toBeGreaterThanOrEqual(currentTime + expiresIn - 5); // Allow small time drift
    expect(decoded.exp).toBeLessThanOrEqual(currentTime + expiresIn + 5);
  });

  it("should throw an error if the JWT is verified with an invalid secret", () => {
    const userId = "test-user-id";

    // Generate the token
    const tokenDTO: TokenDTO = tokenGenerator.generate(userId);

    // Use a different secret for verification
    const invalidSecret = "invalid-secret";

    expect(() => {
      jwt.verify(tokenDTO.token, invalidSecret);
    }).toThrow(jwt.JsonWebTokenError);
  });

  it("should throw an error if the token is malformed", () => {
    const malformedToken = "this.is.not.a.valid.token";

    expect(() => {
      jwt.verify(malformedToken, secret);
    }).toThrow(jwt.JsonWebTokenError);
  });
});

