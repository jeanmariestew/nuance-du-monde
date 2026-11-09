import { cookies, headers } from 'next/headers';

export function getAdminTokenFromEnv(): string | null {
  return process.env.ADMIN_TOKEN || null;
}

function extractBearer(authorization: string | null): string | null {
  if (!authorization) return null;
  const m = authorization.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() || null;
}

/** Valide la session admin via cookie, x-admin-token ou Authorization Bearer. */
export async function hasValidAdminToken(): Promise<boolean> {
  const expected = getAdminTokenFromEnv();
  if (!expected) return false;

  const hdrs = await headers();
  const cookieStore = await cookies();

  const cookieToken = cookieStore.get('admin_token')?.value;
  const headerToken = hdrs.get('x-admin-token');
  const bearerToken = extractBearer(hdrs.get('authorization'));

  return (
    cookieToken === expected ||
    headerToken === expected ||
    bearerToken === expected
  );
}
