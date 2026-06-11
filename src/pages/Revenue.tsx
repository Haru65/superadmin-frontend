import { useEffect, useMemo, useState } from 'react'
import { IndianRupee, ReceiptIndianRupee, ShoppingBag, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { superadminService } from '@/api/superadminService'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order, SourceErrors } from '@/types/superadmin'
import { formatCurrency } from '@/utils/formatCurrency'

export const Revenue = () => {
  const [orders, setOrders] = useState<Order[]>()
  const [errors, setErrors] = useState<SourceErrors>({})
  useEffect(() => { void superadminService.getOrders().then((result) => { setOrders(result.data); setErrors(result.errors) }) }, [])
  const data = useMemo(() => {
    const source = orders || []; const paid = source.filter((item) => item.paymentStatus === 'paid').reduce((sum, item) => sum + item.amount, 0); const unpaid = source.filter((item) => item.paymentStatus !== 'paid').reduce((sum, item) => sum + item.amount, 0)
    const monthly = new Map<string, { period: string; month: string; revenue: number; orders: number }>(); source.forEach((order) => { const period = order.createdAt.slice(0, 7); const point = monthly.get(period) || { period, month: new Date(`${period}-01`).toLocaleString('en-IN', { month: 'short' }), revenue: 0, orders: 0 }; point.revenue += order.amount; point.orders += 1; monthly.set(period, point) })
    const paymentMethods = ['cash', 'card', 'upi', 'online', 'unknown'].map((name) => ({ name, value: source.filter((item) => (item.paymentMethod || 'unknown') === name).reduce((sum, item) => sum + item.amount, 0) })).filter((item) => item.value)
    const tenantTypes = ['cafe', 'restaurant', 'lodging'].map((name) => ({ name, value: source.filter((item) => item.tenantType === name).reduce((sum, item) => sum + item.amount, 0) }))
    return { total: paid + unpaid, paid, unpaid, average: source.length ? (paid + unpaid) / source.length : 0, monthly: [...monthly.values()], paymentMethods, tenantTypes }
  }, [orders])
  if (!orders) return <LoadingState />
  return <><PageHeader title="Revenue" description="Revenue calculated at the frontend from normalized order data." /><ErrorState errors={errors} /><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Total Revenue" value={formatCurrency(data.total)} icon={IndianRupee} /><KpiCard label="Paid Revenue" value={formatCurrency(data.paid)} icon={ReceiptIndianRupee} tone="emerald" /><KpiCard label="Unpaid Revenue" value={formatCurrency(data.unpaid)} icon={Wallet} tone="amber" /><KpiCard label="Average Order Value" value={formatCurrency(data.average)} icon={ShoppingBag} tone="violet" /></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><RevenueChart data={data.monthly} /></CardContent></Card><Card><CardHeader><CardTitle>Revenue by Payment Method</CardTitle></CardHeader><CardContent><ResponsiveContainer height={250} width="100%"><BarChart data={data.paymentMethods}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Bar dataKey="value" fill="#1687d9" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card><Card><CardHeader><CardTitle>Revenue by Business Type</CardTitle></CardHeader><CardContent><ResponsiveContainer height={250} width="100%"><BarChart data={data.tenantTypes}><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card></div></>
}
