import { gatewayApi as api } from './apiClient'

export const cafeApi = {
  getTenant: (id: string) => api.get(`/superadmin/tenants/cafe/${id}`),
  deleteTenant: (id: string) => api.delete(`/superadmin/tenants/cafe/${id}`),
  setStatus: (id: string, status: 'active' | 'paused') => api.patch(`/superadmin/tenants/cafe/${id}/status`, { status }),
  getPaymentConfig: (tenantId: string) => api.get(`/superadmin/tenants/cafe/${tenantId}/payment-config`),
  savePaymentConfig: (tenantId: string, payload: Record<string, unknown>) => api.post(`/superadmin/tenants/cafe/${tenantId}/payment-config`, payload),
  validatePaymentConfig: (tenantId: string, payload: Record<string, unknown>) => api.post(`/superadmin/tenants/cafe/${tenantId}/payment-config/validate`, payload),
}
