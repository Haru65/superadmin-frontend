import { gatewayApi } from './apiClient'
import type {
  BackendSource,
  DashboardData,
  LoadResult,
  Order,
  PaymentConfig,
  SourceErrors,
  Subscription,
  SuperAdminUser,
  Tenant,
} from '@/types/superadmin'

type SourceState = { success: boolean; error: string | null }
type Sources = Partial<Record<BackendSource, SourceState>>
type ListResponse<T> = { success: true; data: T[]; meta?: { sources?: Sources } }
type DataResponse<T> = { success: true; data: T }

const sourceNames: BackendSource[] = ['cafe', 'restaurant', 'lodging']
const errorsFrom = (sources?: Sources): SourceErrors => Object.fromEntries(
  Object.entries(sources || {}).filter(([, state]) => !state.success).map(([source, state]) => [source, state.error || 'Source API unavailable']),
) as SourceErrors
const reference = (id: string, fallback: BackendSource = 'restaurant') => {
  const [prefix, ...parts] = id.split(':')
  return sourceNames.includes(prefix as BackendSource) && parts.length
    ? { source: prefix as BackendSource, id: parts.join(':') }
    : { source: fallback, id }
}
const tenantReference = (tenant: Tenant) => ({ source: tenant.source || tenant.type, id: tenant.sourceId || reference(tenant.id, tenant.type).id })
const list = async <T>(url: string): Promise<LoadResult<T[]>> => {
  const { data } = await gatewayApi.get<ListResponse<T>>(url)
  return { data: data.data, errors: errorsFrom(data.meta?.sources) }
}

export const superadminService = {
  async login(email: string, password: string) {
    const { data } = await gatewayApi.post<DataResponse<{ token: string }>>('/auth/login', { email, password })
    return data.data
  },

  getTenants: () => list<Tenant>('/superadmin/tenants'),
  getUsers: (tenants?: Tenant[]) => { void tenants; return list<SuperAdminUser>('/superadmin/users') },
  getOrders: (tenants?: Tenant[]) => { void tenants; return list<Order>('/superadmin/orders') },
  getSubscriptions: (tenants?: Tenant[]) => { void tenants; return list<Subscription>('/superadmin/subscriptions') },

  async getDashboard(): Promise<DashboardData> {
    const { data } = await gatewayApi.get<DataResponse<Record<string, any>>>('/superadmin/dashboard')
    const dashboard = data.data
    const orders = new Map<string, number>((dashboard.monthlyOrders || []).map((point: any) => [point.period, point.orders]))
    return {
      totalTenants: dashboard.totalTenants,
      activeTenants: dashboard.activeTenants,
      totalOrders: dashboard.totalOrders,
      totalRevenue: dashboard.totalRevenue,
      paidRevenue: dashboard.paidRevenue,
      unpaidRevenue: dashboard.unpaidRevenue,
      averageOrderValue: dashboard.averageOrderValue,
      totalUsers: dashboard.totalUsers,
      activeSubscriptions: dashboard.activeSubscriptions,
      monthly: (dashboard.monthlyRevenue || []).map((point: any) => ({ ...point, orders: orders.get(point.period) || 0 })),
      tenantGrowth: (dashboard.tenantGrowth || []).map((point: any) => ({ ...point, revenue: 0, orders: 0, tenants: point.count })),
      orderTypes: (dashboard.orderTypeBreakdown || []).map((point: any) => ({ name: point.type, value: point.count })),
      paymentMethods: (dashboard.paymentMethodBreakdown || []).map((point: any) => ({ name: point.method, value: point.count })),
      errors: errorsFrom(dashboard.sources),
    }
  },

  async getTenant(id: string, type: BackendSource) {
    const ref = reference(id, type)
    const [{ data }, users, orders, subscriptions] = await Promise.all([
      gatewayApi.get<DataResponse<Tenant>>(`/superadmin/tenants/${ref.source}/${ref.id}`),
      this.getUsers(),
      this.getOrders(),
      this.getSubscriptions(),
    ])
    const tenant = data.data
    const payment = await this.getPaymentConfig(tenant).catch(() => null)
    return {
      tenant,
      users: users.data.filter((item) => item.tenantId === tenant.id),
      orders: orders.data.filter((item) => item.tenantId === tenant.id).slice(0, 8),
      subscription: subscriptions.data.find((item) => item.tenantId === tenant.id),
      payment,
    }
  },

  async setTenantStatus(tenant: Tenant, nextStatus?: 'active' | 'paused') {
    const ref = tenantReference(tenant)
    const status = nextStatus || (tenant.status === 'active' ? 'paused' : 'active')
    return gatewayApi.patch(`/superadmin/tenants/${ref.source}/${ref.id}/status`, { status })
  },
  async createTenant(payload: Record<string, unknown>) {
    return gatewayApi.post('/superadmin/tenants', payload)
  },
  async updateTenant(tenant: Tenant, payload: Record<string, unknown>) {
    const ref = tenantReference(tenant)
    return gatewayApi.put(`/superadmin/tenants/${ref.source}/${ref.id}`, payload)
  },
  async deleteTenant(tenant: Tenant) {
    const ref = tenantReference(tenant)
    return gatewayApi.delete(`/superadmin/tenants/${ref.source}/${ref.id}`)
  },
  async createUser(payload: Record<string, unknown>) {
    const ref = reference(String(payload.tenantId || payload.restaurantId || ''))
    return gatewayApi.post('/superadmin/users', { ...payload, source: ref.source, tenantId: ref.id, restaurantId: ref.id })
  },
  async updateUser(id: string, payload: Record<string, unknown>) {
    const ref = reference(id)
    const tenantValue = payload.tenantId || payload.restaurantId
    const tenantPayload = tenantValue ? (() => {
      const tenantRef = reference(String(tenantValue), ref.source)
      return { tenantId: tenantRef.id, restaurantId: tenantRef.id }
    })() : {}
    return gatewayApi.patch(`/superadmin/users/${ref.source}/${ref.id}`, { ...payload, ...tenantPayload })
  },
  async deleteUser(id: string) {
    const ref = reference(id)
    return gatewayApi.delete(`/superadmin/users/${ref.source}/${ref.id}`)
  },
  async resetPassword(id: string, password: string) {
    const ref = reference(id)
    return gatewayApi.post(`/superadmin/users/${ref.source}/${ref.id}/reset-password`, { password })
  },
  async updateSubscription(id: string, payload: Record<string, unknown>) {
    const ref = reference(id)
    return gatewayApi.patch(`/superadmin/subscriptions/${ref.source}/${ref.id}`, payload)
  },

  async getPaymentConfig(tenant: Tenant): Promise<PaymentConfig> {
    const ref = tenantReference(tenant)
    const { data } = await gatewayApi.get<DataResponse<PaymentConfig>>(`/superadmin/tenants/${ref.source}/${ref.id}/payment-config`)
    return data.data
  },
  async savePaymentConfig(tenant: Tenant, payload: Record<string, unknown>) {
    const ref = tenantReference(tenant)
    return gatewayApi.post(`/superadmin/tenants/${ref.source}/${ref.id}/payment-config`, payload)
  },
  async validatePaymentConfig(tenant: Tenant, payload: Record<string, unknown>) {
    const ref = tenantReference(tenant)
    return gatewayApi.post(`/superadmin/tenants/${ref.source}/${ref.id}/payment-config/validate`, payload)
  },
}
