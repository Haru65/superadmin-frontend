export type TenantType = 'cafe' | 'restaurant' | 'lodging'
export type TenantStatus = 'active' | 'paused' | 'inactive' | 'suspended'
export type SubscriptionStatus = 'active' | 'grace' | 'suspended' | 'inactive' | 'expired'
export type BackendSource = TenantType

export type Tenant = {
  id: string
  sourceId?: string
  source?: BackendSource
  name: string
  slug: string
  type: TenantType
  status: TenantStatus
  logoUrl?: string | null
  address?: string | null
  phone?: string | null
  ownerName?: string | null
  ownerEmail?: string | null
  createdAt?: string
  subscription?: {
    plan?: string
    status?: SubscriptionStatus
    expiryDate?: string
  }
  payment?: {
    provider?: string
    isConfigured: boolean
    isActive?: boolean
  }
}

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'staff' | 'receptionist' | 'housekeeping'

export type SuperAdminUser = {
  id: string
  sourceId?: string
  source?: BackendSource
  tenantId?: string
  tenantName?: string
  tenantType?: TenantType
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  passwordResetRequired?: boolean
  createdAt?: string
}

export type Order = {
  id: string
  sourceId?: string
  source?: BackendSource
  tenantId: string
  tenantName: string
  tenantType: TenantType
  amount: number
  paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed'
  paymentMethod?: 'cash' | 'card' | 'upi' | 'online' | 'unknown'
  orderType?: 'dine-in' | 'takeaway' | 'delivery' | 'room-booking' | 'food-order' | 'service-request'
  createdAt: string
}

export type Subscription = {
  id: string
  sourceId?: string
  source?: BackendSource
  tenantId: string
  tenantName: string
  tenantType: TenantType
  ownerName?: string
  plan: 'Free' | 'Standard' | 'Premium' | 'Enterprise'
  status: SubscriptionStatus
  startDate?: string
  expiryDate?: string
  gracePeriodDays?: number
  overdueDays?: number
}

export type PaymentConfig = {
  id?: string
  source?: BackendSource
  tenantId: string
  tenantName?: string
  provider: 'paytm' | 'razorpay' | 'upi' | 'none'
  keyId?: string
  keySecretMasked?: string
  webhookSecretMasked?: string
  website?: string
  isActive: boolean
  isConfigured: boolean
  createdAt?: string
}

export type SourceErrors = Partial<Record<BackendSource, string>>
export type MonthlyPoint = { period: string; month: string; revenue: number; orders: number; tenants?: number }
export type BreakdownPoint = { name: string; value: number }

export type DashboardData = {
  totalTenants: number
  activeTenants: number
  totalOrders: number
  totalRevenue: number
  paidRevenue: number
  unpaidRevenue: number
  averageOrderValue: number
  totalUsers: number
  activeSubscriptions: number
  monthly: MonthlyPoint[]
  tenantGrowth: MonthlyPoint[]
  orderTypes: BreakdownPoint[]
  paymentMethods: BreakdownPoint[]
  errors: SourceErrors
}

export type LoadResult<T> = { data: T; errors: SourceErrors }
