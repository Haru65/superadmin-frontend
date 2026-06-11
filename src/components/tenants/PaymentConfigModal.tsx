import { useEffect, useState } from 'react'
import { CheckCircle2, CreditCard, Loader2, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PaymentConfig, Tenant } from '@/types/superadmin'

type FormState = {
  accountId: string
  accountLabel: string
  provider: PaymentConfig['provider']
  keyId: string
  keySecret: string
  webhookSecret: string
  website: string
  isActive: boolean
  isDefault: boolean
}

const blankForm = (accountNumber = 1): FormState => ({
  accountId: '',
  accountLabel: accountNumber === 1 ? 'Primary' : `Paytm account ${accountNumber}`,
  provider: 'paytm',
  keyId: '',
  keySecret: '',
  webhookSecret: '',
  website: 'WEBSTAGING',
  isActive: true,
  isDefault: accountNumber === 1,
})

const formFromConfig = (config: PaymentConfig): FormState => ({
  accountId: config.id || '',
  accountLabel: config.accountLabel || 'Primary',
  provider: config.provider,
  keyId: config.keyId || '',
  keySecret: '',
  webhookSecret: '',
  website: config.website || 'WEBSTAGING',
  isActive: config.isActive,
  isDefault: Boolean(config.isDefault),
})

export const PaymentConfigModal = ({ tenant, open, onClose }: { tenant?: Tenant; open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState<FormState>(blankForm())
  const [masked, setMasked] = useState({ keySecret: '', webhookSecret: '' })
  const [accounts, setAccounts] = useState<PaymentConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [validating, setValidating] = useState(false)

  const selectAccount = (account: PaymentConfig) => {
    setForm(formFromConfig(account))
    setMasked({ keySecret: account.keySecretMasked || '', webhookSecret: account.webhookSecretMasked || '' })
  }

  const loadConfig = async (selectedId?: string) => {
    if (!tenant) return
    setLoading(true)
    try {
      const config = await superadminService.getPaymentConfig(tenant)
      const nextAccounts = config.accounts?.length ? config.accounts : config.isConfigured ? [config] : []
      setAccounts(nextAccounts)
      const selected = nextAccounts.find((account) => account.id === selectedId)
        || nextAccounts.find((account) => account.isDefault)
        || nextAccounts[0]
      if (selected) selectAccount(selected)
      else {
        setForm(blankForm())
        setMasked({ keySecret: '', webhookSecret: '' })
      }
    } catch {
      setAccounts([])
      setForm(blankForm())
      setMasked({ keySecret: '', webhookSecret: '' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!tenant || !open) return
    void loadConfig()
  }, [tenant, open])

  if (!tenant) return null

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }))
  const addAccount = () => {
    setForm(blankForm(accounts.length + 1))
    setMasked({ keySecret: '', webhookSecret: '' })
  }
  const payload = {
    accountId: form.accountId || undefined,
    accountLabel: form.accountLabel.trim(),
    provider: form.provider,
    keyId: form.keyId.trim(),
    keySecret: form.keySecret || undefined,
    webhookSecret: form.webhookSecret || undefined,
    website: form.website.trim(),
    isActive: form.isActive,
    isDefault: form.isDefault,
  }

  const validate = async () => {
    setValidating(true)
    try {
      const { data } = await superadminService.validatePaymentConfig(tenant, payload)
      toast.success(data.data?.message || data.message || 'Credential format validated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Validation failed')
    } finally {
      setValidating(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const response = await superadminService.savePaymentConfig(tenant, payload)
      const savedId = response.data?.data?.id || form.accountId
      toast.success('Payment account saved')
      await loadConfig(savedId)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Payment configuration</DialogTitle>
        <DialogDescription>{tenant.name}. Add more than one Paytm account and choose the default checkout account.</DialogDescription>
        {loading ? (
          <div className="mt-5 flex h-40 items-center justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Paytm accounts</span>
                <Button type="button" size="sm" variant="outline" onClick={addAccount}><Plus className="h-4 w-4" />Add</Button>
              </div>
              <div className="space-y-2">
                {accounts.length === 0 && <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">No accounts saved yet.</div>}
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => selectAccount(account)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition',
                      form.accountId === account.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <CreditCard className="h-4 w-4 text-brand-600" />
                      {account.accountLabel || 'Paytm account'}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      {account.isDefault && <><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />Default</>}
                      {!account.isDefault && (account.isActive ? 'Active' : 'Inactive')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold text-slate-600">
                  Account name
                  <Input className="mt-1" value={form.accountLabel} onChange={(e) => set('accountLabel', e.target.value)} />
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  Provider
                  <select value={form.provider} onChange={(e) => set('provider', e.target.value as PaymentConfig['provider'])} className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm">
                    <option value="paytm">Paytm</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </label>
              </div>
              <label className="block text-xs font-bold text-slate-600">Merchant ID / Key ID<Input className="mt-1" value={form.keyId} onChange={(e) => set('keyId', e.target.value)} /></label>
              <label className="block text-xs font-bold text-slate-600">
                Merchant Key / Key Secret
                <Input className="mt-1" type="password" placeholder={form.accountId ? 'Enter a new secret to update' : 'Required for a new account'} value={form.keySecret} onChange={(e) => set('keySecret', e.target.value)} />
                {masked.keySecret && <span className="mt-1 block font-normal text-slate-400">Stored secret: {masked.keySecret}</span>}
              </label>
              <label className="block text-xs font-bold text-slate-600">
                Webhook Secret
                <Input className="mt-1" type="password" placeholder="Optional" value={form.webhookSecret} onChange={(e) => set('webhookSecret', e.target.value)} />
                {masked.webhookSecret && <span className="mt-1 block font-normal text-slate-400">Stored secret: {masked.webhookSecret}</span>}
              </label>
              <label className="block text-xs font-bold text-slate-600">Website<Input className="mt-1" value={form.website} onChange={(e) => set('website', e.target.value)} /></label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Active gateway</label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-semibold"><input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} /> Default for checkout</label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" disabled={validating || saving} onClick={validate}><CheckCircle2 className="h-4 w-4" />Validate</Button>
                <Button disabled={saving || validating} onClick={save}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save account</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
