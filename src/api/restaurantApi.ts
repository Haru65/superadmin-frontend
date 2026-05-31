import { gatewayApi as api } from './apiClient'

export const restaurantApi = {
  deleteTenant: (id: string) => api.delete(`/superadmin/tenants/restaurant/${id}`),
  getUsers: () => api.get('/superadmin/users'),
  createUser: (payload: Record<string, unknown>) => api.post('/superadmin/users', payload),
  updateUser: (id: string, payload: Record<string, unknown>) => api.patch(`/superadmin/users/restaurant/${id}`, payload),
  deleteUser: (id: string) => api.delete(`/superadmin/users/restaurant/${id}`),
  resetPassword: (id: string, password: string) => api.post(`/superadmin/users/restaurant/${id}/reset-password`, { password }),
  getOrders: () => api.get('/superadmin/orders'),
  getAnalytics: () => api.get('/superadmin/analytics'),
  getSubscriptions: () => api.get('/superadmin/subscriptions'),
  updateSubscription: (id: string, payload: Record<string, unknown>) => api.patch(`/superadmin/subscriptions/restaurant/${id}`, payload),
}
