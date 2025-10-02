import { NextRequest } from 'next/server';
import { TokenPayload, verifyToken } from './jwt';

export async function verifyAuth(
  request: NextRequest
): Promise<TokenPayload | null> {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  const decodedPayload = await verifyToken(token);

  return decodedPayload;
}
