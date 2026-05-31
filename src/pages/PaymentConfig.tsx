import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Search } from 'lucide-react'
import { superadminService } from '@/api/superadminService'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PaymentConfigModal } from '@/components/tenants/PaymentConfigModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { SourceErrors, Tenant } from '@/types/superadmin'

export const PaymentConfig = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [errors, setErrors] = useState<SourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Tenant>()
  const [search, setSearch] = useState('')
  useEffect(() => { void superadminService.getTenants().then((result) => { setTenants(result.data); setErrors(result.errors); setLoading(false) }) }, [])
  const filtered = useMemo(() => tenants.filter((tenant) => [tenant.name, tenant.slug, tenant.type].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [tenants, search])
  return <><PageHeader title="Payment Config" description="Configure gateways per tenant. Raw key secrets are never rendered." /><ErrorState errors={errors} /><div className="relative my-5 max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search businesses..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>{loading ? <LoadingState /> : !filtered.length ? <EmptyState title="No businesses found" /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((tenant) => <Card className="p-5" key={`${tenant.type}-${tenant.id}`}><div className="flex items-start justify-between"><div><h3 className="font-bold">{tenant.name}</h3><p className="mt-1 text-xs capitalize text-slate-400">{tenant.type}</p></div><CreditCard className="h-5 w-5 text-brand-600" /></div><div className="mt-4 flex items-center justify-between text-sm"><span className="text-slate-500">Gateway</span><span>{tenant.payment?.provider || 'none'}</span></div><div className="mt-2 flex items-center justify-between text-sm"><span className="text-slate-500">Configured</span><StatusBadge status={tenant.payment?.isConfigured ? 'active' : 'inactive'} /></div><Button variant="outline" className="mt-5 w-full" onClick={() => setSelected(tenant)}>Configure</Button></Card>)}</div>}<PaymentConfigModal tenant={selected} open={Boolean(selected)} onClose={() => setSelected(undefined)} /></>
}
