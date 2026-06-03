import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { SuperAdminUser, Tenant, UserRole } from '@/types/superadmin'

type Props = {
  open: boolean
  user?: SuperAdminUser
  tenants: Tenant[]
  onClose: () => void
  onSaved: () => void
}

export const EditUserModal = ({ open, user, tenants, onClose, onSaved }: Props) => {
  const supportedTenants = useMemo(() => tenants.filter((tenant) => ['cafe', 'restaurant'].includes(tenant.source || tenant.type)), [tenants])
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' as UserRole, tenantId: '', status: 'active' as 'active' | 'inactive' })
  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      tenantId: user.tenantId || '',
      status: user.status,
    })
  }, [user])
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent><DialogTitle>Edit user</DialogTitle><DialogDescription>Update the login, role, status, and assigned business.</DialogDescription><div className="mt-5 space-y-3"><Input placeholder="Full name" value={form.name} onChange={(event) => set('name', event.target.value)} /><Input type="email" placeholder="Email" value={form.email} onChange={(event) => set('email', event.target.value)} /><select className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.role} onChange={(event) => set('role', event.target.value)}><option value="admin">Admin</option><option value="manager">Manager</option><option value="staff">Staff</option><option value="receptionist">Receptionist</option><option value="housekeeping">Housekeeping</option></select><select className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.tenantId} onChange={(event) => set('tenantId', event.target.value)}><option value="">No business</option>{supportedTenants.map((tenant) => <option key={`${tenant.type}-${tenant.id}`} value={tenant.id}>{tenant.name} ({tenant.type})</option>)}</select><select className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.status} onChange={(event) => set('status', event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select><div className="flex justify-end gap-2 pt-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!user || !form.name || !form.email} onClick={async () => { if (!user) return; try { await superadminService.updateUser(user.id, form); toast.success('User updated'); onSaved(); onClose() } catch (error) { toast.error(error instanceof Error ? error.message : 'Update failed') } }}>Save user</Button></div></div></DialogContent></Dialog>
}
