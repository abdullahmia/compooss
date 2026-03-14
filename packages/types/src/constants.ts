/** MongoDB system databases that must not be accessible in the playground (admin, local, config). */
export const PROTECTED_DATABASES = ["admin", "local", "config"] as const;

export function isProtectedDatabase(dbName: string): boolean {
  const lower = dbName.toLowerCase();
  return (PROTECTED_DATABASES as readonly string[]).includes(lower);
}
