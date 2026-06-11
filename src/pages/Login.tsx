import { useState } from 'react'
import { BarChart3, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { superadminService } from '@/api/superadminService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isAuthenticated, setToken } from '@/utils/auth'

export const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />
  return <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
    <section className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-brand-500 p-3"><BarChart3 /></div><div><h1 className="text-xl font-extrabold">LogDine SuperAdmin</h1><p className="text-sm text-slate-400">One dashboard for every business</p></div></div><div><p className="max-w-lg text-4xl font-extrabold leading-tight">Operate cafes, restaurants, and lodging tenants from one calm command center.</p><p className="mt-5 max-w-lg text-slate-300">Live metrics, subscriptions, payments, users, and tenant operations are normalized across your existing APIs.</p></div><p className="text-xs text-slate-500">LogDine SaaS Platform</p></section>
    <section className="flex items-center justify-center p-6"><form className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-panel" onSubmit={async (event) => { event.preventDefault(); setLoading(true); try { const data = await superadminService.login(email, password); setToken(data.token); toast.success('Welcome back'); navigate('/dashboard') } catch (error) { toast.error(error instanceof Error ? error.message : 'Login failed') } finally { setLoading(false) } }}><div className="mb-7 lg:hidden"><h1 className="text-xl font-extrabold text-ink">LogDine SuperAdmin</h1></div><h2 className="text-2xl font-extrabold text-slate-900">Sign in</h2><p className="mt-1 text-sm text-slate-500">Use your platform superadmin account.</p><label className="mt-6 block text-sm font-bold text-slate-700">Email<div className="relative mt-2"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></label><label className="mt-4 block text-sm font-bold text-slate-700">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></label><Button className="mt-6 w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}Sign in</Button></form></section>
  </div>
}
