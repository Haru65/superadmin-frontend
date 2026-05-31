import type { Tenant, TenantStatus, TenantType } from '@/types/superadmin'

const status = (value: unknown): TenantStatus => {
  const normalized = String(value ?? 'inactive').toLowerCase()
  if (normalized === 'active') return 'active'
  if (normalized === 'paused') return 'paused'
  if (normalized === 'suspended') return 'suspended'
  return 'inactive'
}

const slugify = (value: unknown) => String(value ?? 'tenant').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const normalizeTenant = (row: Record<string, any>, type: TenantType): Tenant => ({
  id: String(row.id ?? row.tenant_id ?? row.restaurant_id),
  name: String(row.name ?? row.restaurant_name ?? row.businessName ?? 'Unnamed business'),
  slug: String(row.slug ?? slugify(row.name ?? row.restaurant_name)),
  type,
  status: status(row.status ?? (row.is_active === false || row.is_active === 0 ? 'inactive' : 'active')),
  logoUrl: row.logoUrl ?? row.logo_url ?? row.logo ?? null,
  address: row.address ?? row.city ?? null,
  phone: row.phone ?? row.contact_phone ?? null,
  ownerName: row.ownerName ?? row.owner_name ?? row.owner ?? null,
  ownerEmail: row.ownerEmail ?? row.owner_email ?? row.contact_email ?? null,
  createdAt: row.createdAt ?? row.created_at,
  subscription: row.subscription ? {
    plan: row.subscription.plan,
    status: String(row.subscription.status ?? 'inactive').toLowerCase() as Tenant['subscription'] extends { status?: infer S } ? S : never,
    expiryDate: row.subscription.expiryDate ?? row.subscription.expiry_date,
  } : row.plan ? {
    plan: row.plan,
    status: String(row.subscription_status ?? 'inactive').toLowerCase() as any,
    expiryDate: row.expiry_date,
  } : undefined,
  payment: row.payment ? {
    provider: row.payment.provider,
    isConfigured: Boolean(row.payment.isConfigured ?? row.payment.is_configured),
    isActive: Boolean(row.payment.isActive ?? row.payment.is_active),
  } : {
    provider: row.payment_provider,
    isConfigured: Boolean(row.payment_configured ?? row.payment_provider),
    isActive: Boolean(row.payment_active),
  },
})
