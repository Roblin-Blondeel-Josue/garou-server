export function hasRoles(
  user: {
    id: string;
    email: string;
    role: string;
  } | null,
  role: string
) {
  if (!user || !user?.id || !user?.role) return false;
  return role.includes(role);
}
