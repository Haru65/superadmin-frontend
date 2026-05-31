import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { PaymentConfigModal } from '@/components/tenants/PaymentConfigModal'
import { TenantCard } from '@/components/tenants/TenantCard'
import { TenantFilters, type TenantFilterState } from '@/components/tenants/TenantFilters'
import { TenantTable } from '@/components/tenants/TenantTable'
import type { SourceErrors, Tenant } from '@/types/superadmin'

export const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [errors, setErrors] = useState<SourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TenantFilterState>({ search: '', type: 'all', status: 'all' })
  const [paymentTenant, setPaymentTenant] = useState<Tenant>()
  const [pending, setPending] = useState<{ tenant: Tenant; action: 'status' | 'delete' }>()
  const load = async () => { setLoading(true); const result = await superadminService.getTenants(); setTenants(result.data); setErrors(result.errors); setLoading(false) }
  useEffect(() => { void load() }, [])
  const filtered = useMemo(() => tenants.filter((tenant) => {
    const term = filters.search.toLowerCase()
    return (filters.type === 'all' || tenant.type === filters.type) && (filters.status === 'all' || tenant.status === filters.status) && [tenant.name, tenant.slug, tenant.ownerEmail, tenant.phone].some((value) => String(value || '').toLowerCase().includes(term))
  }), [tenants, filters])
  const props = { tenants: filtered, onPayment: setPaymentTenant, onStatus: (tenant: Tenant) => setPending({ tenant, action: 'status' as const }), onDelete: (tenant: Tenant) => setPending({ tenant, action: 'delete' as const }) }
  return <><PageHeader title="Businesses" description="Every cafe, restaurant, and lodging property represented as a tenant." /><ErrorState errors={errors} /><div className="mt-5"><TenantFilters value={filters} onChange={setFilters} /></div>{loading ? <div className="mt-5"><LoadingState /></div> : !filtered.length ? <EmptyState title="No matching businesses" /> : <><div className="mt-5 hidden xl:block"><TenantTable {...props} /></div><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:hidden">{filtered.map((tenant) => <TenantCard key={`${tenant.type}-${tenant.id}`} tenant={tenant} onPayment={setPaymentTenant} onStatus={props.onStatus} onDelete={props.onDelete} />)}</div></>}<PaymentConfigModal tenant={paymentTenant} open={Boolean(paymentTenant)} onClose={() => setPaymentTenant(undefined)} /><ConfirmDialog open={Boolean(pending)} title={pending?.action === 'delete' ? 'Delete business?' : 'Change business status?'} description={pending?.action === 'delete' ? `This will delete ${pending?.tenant.name}. This cannot be undone.` : `Pause or resume ${pending?.tenant.name}? This action uses the source backend when available.`} destructive={pending?.action === 'delete'} confirmLabel={pending?.action === 'delete' ? 'Delete' : 'Continue'} onCancel={() => setPending(undefined)} onConfirm={async () => { if (!pending) return; try { if (pending.action === 'delete') await superadminService.deleteTenant(pending.tenant); else await superadminService.setTenantStatus(pending.tenant); toast.success('Business updated'); await load() } catch (error) { toast.error(error instanceof Error ? error.message : 'Action failed') } finally { setPending(undefined) } }} /></>
}
