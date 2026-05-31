import type { SuperAdminUser, Tenant, TenantType, UserRole } from '@/types/superadmin'

export const normalizeUser = (row: Record<string, any>, defaultType: TenantType, tenants: Tenant[]): SuperAdminUser => {
  const tenantId = String(row.tenantId ?? row.tenant_id ?? row.restaurant_id ?? '')
  const tenant = tenants.find((item) => item.id === tenantId)
  return {
    id: String(row.id),
    tenantId: tenantId || undefined,
    tenantName: row.tenantName ?? row.tenant_name ?? row.restaurant_name ?? tenant?.name,
    tenantType: row.tenantType ?? row.tenant_type ?? tenant?.type ?? defaultType,
    name: String(row.name ?? 'Unnamed user'),
    email: String(row.email ?? ''),
    role: String(row.role ?? 'staff').toLowerCase() as UserRole,
    status: String(row.status ?? (row.is_active === false || row.is_active === 0 ? 'inactive' : 'active')).toLowerCase() === 'active' ? 'active' : 'inactive',
    passwordResetRequired: Boolean(row.passwordResetRequired ?? row.password_reset_required ?? row.must_change_password),
    createdAt: row.createdAt ?? row.created_at,
  }
}
