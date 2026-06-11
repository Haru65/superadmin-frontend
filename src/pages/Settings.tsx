import { useState } from 'react'
import { Bell, Database, ShieldCheck, Warehouse } from 'lucide-react'
import { SUPERADMIN_API_URL } from '@/api/apiClient'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card } from '@/components/ui/card'

const initial = { notifications: true, auditLogs: true, maintenance: false }
export const Settings = () => {
  const [settings, setSettings] = useState(initial)
  const toggle = (key: keyof typeof initial) => setSettings((current) => ({ ...current, [key]: !current[key] }))
  return <><PageHeader title="Settings" description="Platform preferences and configured gateway." /><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-bold">Platform preferences</h2><div className="mt-4 space-y-3">{[{ key: 'notifications', label: 'System notifications', icon: Bell }, { key: 'auditLogs', label: 'Audit event tracking', icon: ShieldCheck }, { key: 'maintenance', label: 'Maintenance banner', icon: Warehouse }].map(({ key, label, icon: Icon }) => <label key={key} className="flex items-center justify-between rounded-xl border p-3"><span className="flex items-center gap-3 text-sm font-semibold"><Icon className="h-4 w-4 text-brand-600" />{label}</span><input type="checkbox" checked={settings[key as keyof typeof initial]} onChange={() => toggle(key as keyof typeof initial)} /></label>)}</div></Card><Card className="p-5"><h2 className="flex items-center gap-2 font-bold"><Database className="h-4 w-4" />SuperAdmin gateway</h2><div className="mt-4 rounded-xl border p-3"><div className="flex items-center justify-between"><b>API Admin</b><StatusBadge status={SUPERADMIN_API_URL ? 'active' : 'inactive'} /></div><p className="mt-1 break-all text-xs text-slate-400">{SUPERADMIN_API_URL || 'Not configured'}</p></div></Card></div></>
}
