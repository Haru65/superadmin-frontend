import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Tenant } from '@/types/superadmin'

const initial = { provider: 'paytm', keyId: '', keySecret: '', webhookSecret: '', website: '', isActive: true }
export const PaymentConfigModal = ({ tenant, open, onClose }: { tenant?: Tenant; open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState(initial)
  const [masked, setMasked] = useState({ keySecret: '', webhookSecret: '' })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!tenant || !open) return
    setLoading(true)
    void superadminService.getPaymentConfig(tenant).then((config) => { setForm({ provider: config.provider, keyId: config.keyId || '', keySecret: '', webhookSecret: '', website: config.website || '', isActive: config.isActive }); setMasked({ keySecret: config.keySecretMasked || '', webhookSecret: config.webhookSecretMasked || '' }) }).catch(() => { setForm(initial); setMasked({ keySecret: '', webhookSecret: '' }) }).finally(() => setLoading(false))
  }, [tenant, open])
  if (!tenant) return null
  const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent><DialogTitle>Payment configuration</DialogTitle><DialogDescription>{tenant.name}. Full secrets are never returned by the API.</DialogDescription>{loading ? <Loader2 className="mt-5 animate-spin" /> : <div className="mt-5 space-y-3"><label className="block text-xs font-bold text-slate-600">Provider<select value={form.provider} onChange={(e) => set('provider', e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3"><option value="paytm">Paytm</option><option value="razorpay">Razorpay</option><option value="upi">UPI</option></select></label><label className="block text-xs font-bold text-slate-600">Key ID<Input className="mt-1" value={form.keyId} onChange={(e) => set('keyId', e.target.value)} /></label><label className="block text-xs font-bold text-slate-600">Key Secret<Input className="mt-1" type="password" placeholder="Enter a new secret to update" value={form.keySecret} onChange={(e) => set('keySecret', e.target.value)} />{masked.keySecret && <span className="mt-1 block font-normal text-slate-400">Stored secret: {masked.keySecret}</span>}</label><label className="block text-xs font-bold text-slate-600">Webhook Secret<Input className="mt-1" type="password" placeholder="Enter a new webhook secret" value={form.webhookSecret} onChange={(e) => set('webhookSecret', e.target.value)} />{masked.webhookSecret && <span className="mt-1 block font-normal text-slate-400">Stored secret: {masked.webhookSecret}</span>}</label><label className="block text-xs font-bold text-slate-600">Website<Input className="mt-1" value={form.website} onChange={(e) => set('website', e.target.value)} /></label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Active gateway</label><div className="flex justify-end gap-2 pt-3"><Button variant="outline" onClick={async () => { try { const { data } = await superadminService.validatePaymentConfig(tenant, form); toast.success(data.message || 'Credential format validated') } catch (error) { toast.error(error instanceof Error ? error.message : 'Validation failed') } }}><CheckCircle2 className="h-4 w-4" />Validate</Button><Button onClick={async () => { try { await superadminService.savePaymentConfig(tenant, form); toast.success('Payment config saved'); onClose() } catch (error) { toast.error(error instanceof Error ? error.message : 'Save failed') } }}>Save config</Button></div></div>}</DialogContent></Dialog>
}
