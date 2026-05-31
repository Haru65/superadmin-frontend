import type { Order, TenantType } from '@/types/superadmin'

export const normalizeOrder = (row: Record<string, any>, type: TenantType, tenantNameById: Map<string, string>): Order => {
  const tenantId = String(row.tenantId ?? row.tenant_id ?? row.restaurant_id ?? '')
  const payment = String(row.paymentStatus ?? row.payment_status ?? 'pending').toLowerCase()
  const paymentStatus: Order['paymentStatus'] = payment === 'completed' ? 'paid' : ['paid', 'unpaid', 'pending', 'failed'].includes(payment) ? payment as Order['paymentStatus'] : 'pending'
  const rawOrderType = String(row.orderType ?? row.order_type ?? row.source_type ?? 'dine-in').toLowerCase()
  const orderType = rawOrderType === 'take-away' ? 'takeaway' : rawOrderType
  return {
    id: String(row.id ?? row.order_number),
    tenantId,
    tenantName: String(row.tenantName ?? row.tenant_name ?? row.restaurant_name ?? tenantNameById.get(tenantId) ?? 'Unknown business'),
    tenantType: type,
    amount: Number(row.amount ?? row.total ?? row.total_amount ?? 0),
    paymentStatus,
    paymentMethod: String(row.paymentMethod ?? row.payment_method ?? row.payment_provider ?? 'unknown').toLowerCase() as Order['paymentMethod'],
    orderType: orderType as Order['orderType'],
    createdAt: String(row.createdAt ?? row.created_at ?? new Date().toISOString()),
  }
}
