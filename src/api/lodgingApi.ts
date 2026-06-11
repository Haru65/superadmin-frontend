import { gatewayApi as api } from './apiClient'

export const lodgingApi = {
  // The gateway safely returns empty lodging data until upstream endpoints are ready.
  getTenant: (id: string) => api.get(`/superadmin/tenants/lodging/${id}`),
}
