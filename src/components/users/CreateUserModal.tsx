import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Tenant, UserRole } from '@/types/superadmin'

export const CreateUserModal = ({ open, tenants, onClose, onCreated }: { open: boolean; tenants: Tenant[]; onClose: () => void; onCreated: () => void }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'admin' as UserRole, tenantId: '', temporaryPassword: '' })
  const supportedTenants = useMemo(() => tenants.filter((tenant) => ['cafe', 'restaurant'].includes(tenant.source || tenant.type)), [tenants])
  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent><DialogTitle>Create user</DialogTitle><DialogDescription>User creation is source-aware for cafe and restaurant businesses.</DialogDescription><div className="mt-5 space-y-3"><Input placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} /><Input type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} /><select className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.role} onChange={(e) => set('role', e.target.value)}><option value="admin">Admin</option><option value="manager">Manager</option><option value="staff">Staff</option><option value="receptionist">Receptionist</option><option value="housekeeping">Housekeeping</option></select><select className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.tenantId} onChange={(e) => set('tenantId', e.target.value)}><option value="">Select a business</option>{supportedTenants.map((tenant) => <option key={`${tenant.type}-${tenant.id}`} value={tenant.id}>{tenant.name} ({tenant.type})</option>)}</select><Input type="password" placeholder="Temporary password" value={form.temporaryPassword} onChange={(e) => set('temporaryPassword', e.target.value)} /><div className="flex justify-end gap-2 pt-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!form.tenantId || !form.temporaryPassword || !supportedTenants.length} onClick={async () => { try { await superadminService.createUser({ ...form, restaurantId: form.tenantId }); toast.success('User created'); onCreated(); onClose() } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to create user') } }}>Create user</Button></div></div></DialogContent></Dialog>
}
