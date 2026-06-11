import { useEffect, useMemo, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Tenant } from '@/types/superadmin'

type Props = {
  tenant?: Tenant
  open: boolean
  onClose: () => void
  onSaved: () => void
}

const MAX_LOGO_SIZE = 5 * 1024 * 1024
const LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(new Error('Unable to read logo image'))
  reader.readAsDataURL(file)
})

const emptyForm = {
  name: '',
  slug: '',
  status: 'active' as 'active' | 'paused',
  ownerName: '',
  ownerEmail: '',
  phone: '',
  address: '',
  plan: 'Standard',
}

export const EditTenantModal = ({ tenant, open, onClose, onSaved }: Props) => {
  const [form, setForm] = useState(emptyForm)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenant) return
    setForm({
      name: tenant.name || '',
      slug: tenant.slug || '',
      status: tenant.status === 'active' ? 'active' : 'paused',
      ownerName: tenant.ownerName || '',
      ownerEmail: tenant.ownerEmail || '',
      phone: tenant.phone || '',
      address: tenant.address || '',
      plan: tenant.subscription?.plan || 'Standard',
    })
    setLogo(null)
    setLogoPreview(tenant.logoUrl || '')
  }, [tenant])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }))
  const clearLogo = () => {
    setLogo(null)
    setLogoPreview(tenant?.logoUrl || '')
  }
  const onLogoChange = async (file?: File) => {
    if (!file) return
    if (!LOGO_TYPES.includes(file.type)) {
      toast.error('Logo must be a JPG, PNG, or WebP image')
      return
    }
    if (file.size > MAX_LOGO_SIZE) {
      toast.error('Logo must be 5MB or smaller')
      return
    }
    setLogo(file)
    setLogoPreview(await fileToDataUrl(file))
  }
  const canSave = useMemo(() => Boolean(tenant && form.name.trim() && form.ownerName.trim()), [form.name, form.ownerName, tenant])

  const save = async () => {
    if (!tenant) return
    setSaving(true)
    try {
      const logoDataUrl = logo ? await fileToDataUrl(logo) : undefined
      await superadminService.updateTenant(tenant, {
        name: form.name,
        slug: form.slug,
        status: form.status,
        ownerName: form.ownerName,
        owner: form.ownerName,
        ownerEmail: form.ownerEmail,
        phone: form.phone,
        contact_phone: form.phone,
        address: form.address,
        city: form.address,
        plan: form.plan,
        subscription: { plan: form.plan, status: tenant.subscription?.status || 'active' },
        ...(logoDataUrl ? { logo: logoDataUrl, logoUrl: logoDataUrl } : {}),
      })
      if (tenant.status !== form.status) {
        await superadminService.setTenantStatus(tenant, form.status)
      }
      toast.success('Business updated')
      onSaved()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update business')
    } finally {
      setSaving(false)
    }
  }

  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent className="max-w-2xl"><DialogTitle>Edit business</DialogTitle><DialogDescription>Update tenant profile, contact, subscription, and logo details.</DialogDescription><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="block text-xs font-bold text-slate-600">Status<select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.status} onChange={(event) => set('status', event.target.value as 'active' | 'paused')}><option value="active">Active</option><option value="paused">Paused</option></select></label><label className="block text-xs font-bold text-slate-600">Plan<select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" value={form.plan} onChange={(event) => set('plan', event.target.value)}><option value="Free">Free</option><option value="Standard">Standard</option><option value="Premium">Premium</option><option value="Enterprise">Enterprise</option></select></label><label className="block text-xs font-bold text-slate-600">Business name<Input className="mt-1" value={form.name} onChange={(event) => set('name', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Slug<Input className="mt-1" value={form.slug} onChange={(event) => set('slug', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Owner name<Input className="mt-1" value={form.ownerName} onChange={(event) => set('ownerName', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Owner email<Input className="mt-1" type="email" value={form.ownerEmail} onChange={(event) => set('ownerEmail', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Phone number<Input className="mt-1" value={form.phone} onChange={(event) => set('phone', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600 sm:col-span-2">Address<Input className="mt-1" value={form.address} onChange={(event) => set('address', event.target.value)} /></label><label className="block text-xs font-bold text-slate-600 sm:col-span-2">Logo image<div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-slate-400">{logoPreview ? <img src={logoPreview} alt="Business logo preview" className="h-full w-full object-cover" /> : <ImageUp className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void onLogoChange(event.target.files?.[0])} /><p className="mt-1 truncate text-[11px] font-normal text-slate-400">{logo ? logo.name : logoPreview ? 'Current logo selected' : 'JPG, PNG, or WebP up to 5MB'}</p></div>{logo && <Button type="button" variant="ghost" size="icon" onClick={clearLogo} title="Clear selected logo"><X className="h-4 w-4" /></Button>}</div></label></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!canSave || saving} onClick={save}>Save changes</Button></div></DialogContent></Dialog>
}
