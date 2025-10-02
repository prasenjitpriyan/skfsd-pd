import { UserRole } from '@/types/user';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';

// FIX: Export the TokenPayload interface to make it reusable.
export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  roles: UserRole[];
}

// Ensure your secrets are properly typed and available
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const secretKey = new TextEncoder().encode(JWT_SECRET);
const refreshSecretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export async function signToken(payload: TokenPayload, isRefreshToken = false) {
  const key = isRefreshToken ? refreshSecretKey : secretKey;
  const expiresIn = isRefreshToken ? '7d' : '15m';

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyToken(
  token: string,
  isRefreshToken = false
): Promise<TokenPayload | null> {
  const key = isRefreshToken ? refreshSecretKey : secretKey;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as TokenPayload;
  } catch (error) {
    console.error('JWT Verification failed:', (error as Error).message);
    return null;
  }
}
