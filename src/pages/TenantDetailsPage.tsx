import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { superadminService } from '@/api/superadminService'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TenantDetails } from '@/components/tenants/TenantDetails'
import { Card } from '@/components/ui/card'
import type { Order, PaymentConfig, Subscription, SuperAdminUser, Tenant, TenantType } from '@/types/superadmin'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

type Details = { tenant: Tenant; users: SuperAdminUser[]; orders: Order[]; subscription?: Subscription; payment?: PaymentConfig | null }
export const TenantDetailsPage = () => {
  const { id = '' } = useParams()
  const [search] = useSearchParams()
  const [details, setDetails] = useState<Details>()
  const [error, setError] = useState('')
  useEffect(() => { void superadminService.getTenant(id, (search.get('type') || 'restaurant') as TenantType).then(setDetails).catch((reason) => setError(reason.message)) }, [id, search])
  if (error) return <Card className="p-6 text-red-700">{error}</Card>
  if (!details) return <LoadingState />
  return <><PageHeader title={details.tenant.name} description="Business details, users, subscription, payments, and recent activity." /><TenantDetails {...details} /><Card className="mt-5 overflow-hidden"><div className="border-b p-5 font-bold">Recent orders</div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Created</th></tr></thead><tbody>{details.orders.map((order) => <tr className="border-t" key={order.id}><td className="px-5 py-3">{order.id}</td><td className="px-5 py-3">{formatCurrency(order.amount)}</td><td className="px-5 py-3"><StatusBadge status={order.paymentStatus} /></td><td className="px-5 py-3">{order.orderType}</td><td className="px-5 py-3">{formatDate(order.createdAt)}</td></tr>)}</tbody></table></div></Card></>
}
