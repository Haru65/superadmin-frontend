import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { superadminService } from '@/api/superadminService'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TenantTypeBadge } from '@/components/common/TenantTypeBadge'
import { Input } from '@/components/ui/input'
import type { Order, SourceErrors } from '@/types/superadmin'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [errors, setErrors] = useState<SourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(() => { void superadminService.getOrders().then((result) => { setOrders(result.data); setErrors(result.errors); setLoading(false) }) }, [])
  const filtered = useMemo(() => orders.filter((order) => [order.id, order.tenantName, order.paymentMethod, order.orderType].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()))), [orders, search])
  return <><PageHeader title="Orders" description="Combined order activity with adapters ready for additional source systems." /><ErrorState errors={errors} /><div className="relative my-5 max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>{loading ? <LoadingState /> : !filtered.length ? <EmptyState title="No orders found" /> : <div className="overflow-x-auto rounded-2xl border bg-white shadow-panel"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3">Order ID</th><th className="px-4 py-3">Business</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Order Type</th><th className="px-4 py-3">Created</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id} className="border-t"><td className="px-4 py-3 font-bold">{order.id}</td><td className="px-4 py-3">{order.tenantName}</td><td className="px-4 py-3"><TenantTypeBadge type={order.tenantType} /></td><td className="px-4 py-3 font-semibold">{formatCurrency(order.amount)}</td><td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td><td className="px-4 py-3 capitalize">{order.paymentMethod}</td><td className="px-4 py-3 capitalize">{order.orderType}</td><td className="px-4 py-3">{formatDate(order.createdAt)}</td></tr>)}</tbody></table></div>}</>
}
