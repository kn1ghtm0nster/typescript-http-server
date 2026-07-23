import * as argon2 from 'argon2';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { UnauthorizedError } from './errors.js';

type Payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string
): string {
  const payload: Payload = {
    iss: 'chirpy',
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenString, secret) as Payload;
    return payload.sub ? payload.sub : '';
  } catch (error) {
    throw new UnauthorizedError('Invalid credentials');
  }
}
