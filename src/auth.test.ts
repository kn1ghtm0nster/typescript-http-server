import { describe, it, expect, beforeAll } from 'vitest';
import {
  makeJWT,
  validateJWT,
  hashPassword,
  checkPasswordHash,
} from './auth.js';

describe('Password Hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe('JWT Generation and Validation', () => {
  const userId = 'user123';
  const secret = 'mySuperSecretKey';

  it('should generate a valid JWT', () => {
    const expiresIn = 60;
    const token = makeJWT(userId, expiresIn, secret);
    expect(token).toBeDefined();
  });

  it('should validate a valid JWT and return the userId', () => {
    const expiresIn = 60;
    const token = makeJWT(userId, expiresIn, secret);
    const validatedUserId = validateJWT(token, secret);
    expect(validatedUserId).toBe(userId);
  });

  it('should throw an error for an invalid JWT', () => {
    const invalidToken = 'invalid.token.here';
    expect(() => validateJWT(invalidToken, secret)).toThrowError();
  });

  it('should throw an error for an expired JWT', () => {
    const expiresIn = -10;
    const expiredToken = makeJWT(userId, expiresIn, secret);
    expect(() => validateJWT(expiredToken, secret)).toThrowError();
  });

  it('should throw an error for wrong secret', () => {
    const expiresIn = 60;
    const token = makeJWT(userId, expiresIn, secret);
    const wrongSecret = 'wrongSecretKey';
    expect(() => validateJWT(token, wrongSecret)).toThrowError();
  });
});
