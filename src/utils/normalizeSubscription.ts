import type { Subscription, Tenant, TenantType } from '@/types/superadmin'

export const normalizeSubscription = (row: Record<string, any>, defaultType: TenantType, tenants: Tenant[]): Subscription => {
  const tenantId = String(row.tenantId ?? row.tenant_id ?? row.restaurant_id ?? '')
  const tenant = tenants.find((item) => item.id === tenantId)
  return {
    id: String(row.id),
    tenantId,
    tenantName: String(row.tenantName ?? row.tenant_name ?? row.restaurant_name ?? row.name ?? tenant?.name ?? 'Unknown business'),
    tenantType: row.tenantType ?? row.tenant_type ?? tenant?.type ?? defaultType,
    ownerName: row.ownerName ?? row.owner_name ?? row.owner,
    plan: row.plan ?? 'Free',
    status: String(row.normalizedStatus ?? row.status ?? 'inactive').toLowerCase() as Subscription['status'],
    startDate: row.startDate ?? row.start_date ?? row.subscription_date,
    expiryDate: row.expiryDate ?? row.expiry_date ?? row.expiry,
    gracePeriodDays: Number(row.gracePeriodDays ?? row.grace_period_days ?? 0),
    overdueDays: Number(row.overdueDays ?? row.overdue_days ?? 0),
  }
}
