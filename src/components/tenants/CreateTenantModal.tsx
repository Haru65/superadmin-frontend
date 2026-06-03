import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { TenantType } from '@/types/superadmin'

type Props = {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

const initial = {
  source: 'restaurant' as TenantType,
  name: '',
  slug: '',
  ownerName: '',
  ownerEmail: '',
  phone: '',
  address: '',
  city: '',
  plan: 'Standard',
  adminName: '',
  adminEmail: '',
  adminPassword: '',
}

export const CreateTenantModal = ({ open, onClose, onCreated }: Props) => {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const canCreate = useMemo(() => {
    if (!form.name.trim()) return false
    if (!form.adminName.trim() || !form.adminEmail.trim() || form.adminPassword.length < 8) return false
    if (form.source === 'restaurant') return Boolean(form.ownerName.trim())
    if (form.source === 'cafe') return true
    return false
  }, [form])

  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent className="max-w-2xl"><DialogTitle>Create business</DialogTitle><DialogDescription>Create the tenant and its first admin login.</DialogDescription><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="block text-xs font-bold text-slate-600">Business type<select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.source} onChange={(event) => set('source', event.target.value)}><option value="restaurant">Restaurant</option><option value="cafe">Cafe</option></select></label><label className="block text-xs font-bold text-slate-600">Plan<select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.plan} onChange={(event) => set('plan', event.target.value)}><option value="Free">Free</option><option value="Standard">Standard</option><option value="Premium">Premium</option><option value="Enterprise">Enterprise</option></select></label><label className="block text-xs font-bold text-slate-600">Business name<Input className="mt-1" value={form.name} onChange={(event) => set('name', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Slug<Input className="mt-1" value={form.slug} onChange={(event) => set('slug', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Owner name<Input className="mt-1" value={form.ownerName} onChange={(event) => set('ownerName', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Owner email<Input className="mt-1" type="email" value={form.ownerEmail} onChange={(event) => set('ownerEmail', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Phone number<Input className="mt-1" value={form.phone} onChange={(event) => set('phone', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">City<Input className="mt-1" value={form.city} onChange={(event) => set('city', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600 sm:col-span-2">Address<Input className="mt-1" value={form.address} onChange={(event) => set('address', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Admin name<Input className="mt-1" value={form.adminName} onChange={(event) => set('adminName', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Admin email<Input className="mt-1" type="email" value={form.adminEmail} onChange={(event) => set('adminEmail', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600 sm:col-span-2">Temporary password<Input className="mt-1" type="password" value={form.adminPassword} onChange={(event) => set('adminPassword', event.target.value)} /></label></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!canCreate || saving} onClick={async () => { setSaving(true); try { await superadminService.createTenant({ ...form, type: form.source, tenantType: form.source, contact_phone: form.phone, phone: form.phone, owner: form.ownerName, adminEmail: form.adminEmail, adminName: form.adminName, adminPassword: form.adminPassword, subscription: { plan: form.plan, status: 'active' } }); toast.success('Business created'); setForm(initial); onCreated(); onClose() } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to create business') } finally { setSaving(false) } }}>Create business</Button></div></DialogContent></Dialog>
}
