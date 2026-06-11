import { useEffect, useState } from 'react'
import { Building2, CreditCard, IndianRupee, ReceiptIndianRupee, ShoppingBag, TrendingUp, Users, Wallet } from 'lucide-react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { superadminService } from '@/api/superadminService'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { OrdersChart } from '@/components/dashboard/OrdersChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { TenantGrowthChart } from '@/components/dashboard/TenantGrowthChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardData } from '@/types/superadmin'
import { formatCurrency } from '@/utils/formatCurrency'

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData>()
  useEffect(() => { void superadminService.getDashboard().then(setData) }, [])
  if (!data) return <LoadingState rows={8} />
  return <><PageHeader title="Dashboard" description="A unified view across cafe, restaurant, and lodging systems." /><ErrorState errors={data.errors} /><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <KpiCard label="Total Businesses" value={data.totalTenants} icon={Building2} hint={`${data.activeTenants} currently active`} />
    <KpiCard label="Active Businesses" value={data.activeTenants} icon={TrendingUp} tone="emerald" />
    <KpiCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={IndianRupee} tone="violet" />
    <KpiCard label="Total Orders" value={data.totalOrders} icon={ShoppingBag} tone="amber" />
    <KpiCard label="Paid Revenue" value={formatCurrency(data.paidRevenue)} icon={ReceiptIndianRupee} tone="emerald" />
    <KpiCard label="Unpaid Revenue" value={formatCurrency(data.unpaidRevenue)} icon={Wallet} tone="amber" />
    <KpiCard label="Average Order Value" value={formatCurrency(data.averageOrderValue)} icon={CreditCard} />
    <KpiCard label="Active Subscriptions" value={data.activeSubscriptions} icon={Users} tone="violet" />
  </div><div className="mt-5 grid gap-5 xl:grid-cols-2"><Card><CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader><CardContent><RevenueChart data={data.monthly} /></CardContent></Card><Card><CardHeader><CardTitle>Monthly Orders</CardTitle></CardHeader><CardContent><OrdersChart data={data.monthly} /></CardContent></Card><Card><CardHeader><CardTitle>Business Growth</CardTitle></CardHeader><CardContent><TenantGrowthChart data={data.tenantGrowth} /></CardContent></Card><Card><CardHeader><CardTitle>Order Type Breakdown</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={data.orderTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} fill="#1687d9" label /><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card><Card><CardHeader><CardTitle>Payment Method Breakdown</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={data.paymentMethods} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} fill="#8b5cf6" label /><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card></div></>
}
