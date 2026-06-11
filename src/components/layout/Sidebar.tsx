import { BarChart3, Building2, CreditCard, LayoutDashboard, LogOut, ReceiptIndianRupee, Settings, ShoppingBag, Users, WalletCards, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { clearToken } from '@/utils/auth'

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Businesses', to: '/tenants', icon: Building2 },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Orders', to: '/orders', icon: ShoppingBag },
  { label: 'Revenue', to: '/revenue', icon: ReceiptIndianRupee },
  { label: 'Subscriptions', to: '/subscriptions', icon: WalletCards },
  { label: 'Payment Config', to: '/payment-config', icon: CreditCard },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate()
  return <>
    {open && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} aria-label="Close menu" />}
    <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink text-white transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-brand-500 p-2"><BarChart3 className="h-5 w-5" /></div><div><p className="font-extrabold">LogDine</p><p className="text-xs text-slate-400">Unified SuperAdmin</p></div></div><button className="lg:hidden" onClick={onClose}><X className="h-5 w-5" /></button></div>
      <nav className="flex-1 space-y-1 p-4">{links.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition', isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white')}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav>
      <div className="border-t border-white/10 p-4"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => { clearToken(); navigate('/login') }}><LogOut className="h-4 w-4" />Logout</button></div>
    </aside>
  </>
}
