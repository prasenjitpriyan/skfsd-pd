import type { User, UserRole } from "@/types/user"
import { useMemo } from "react"
import { useAuth } from "./use-auth"

export function usePermissions() {
  const { user } = useAuth() as { user: User | null }

  const permissions = useMemo(() => {
    if (!user) return []
    return user.roles.flatMap(role => role.permissions)
  }, [user])

  const roles = useMemo<UserRole["role"][]>(() => {
    return user ? user.roles.map(r => r.role) : []
  }, [user])

  const hasPermission = (permission: string) =>
    permissions.includes("*") || permissions.includes(permission)

  const hasRole = (role: UserRole["role"]) => roles.includes(role)

  const hasAnyRole = (requiredRoles: UserRole["role"][]) =>
    requiredRoles.some(r => hasRole(r))

  const hasAllRoles = (requiredRoles: UserRole["role"][]) =>
    requiredRoles.every(r => hasRole(r))

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  }
}
