import { cookies, headers } from 'next/headers';

export function getAdminTokenFromEnv(): string | null {
  return process.env.ADMIN_TOKEN || null;
}

export async function hasValidAdminToken(): Promise<boolean> {
  const expected = getAdminTokenFromEnv();
  if (!expected) return false;
  const hdrs = await headers();
  const cookieStore = await cookies();
  const headerToken = hdrs.get('x-admin-token');
  const cookieToken = cookieStore.get('admin_token')?.value;
  return headerToken === expected || cookieToken === expected;
}
