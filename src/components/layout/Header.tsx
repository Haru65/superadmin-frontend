import { Bell, Menu, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const Header = ({ onMenu }: { onMenu: () => void }) =>
  <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
    <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={onMenu}><Menu className="h-5 w-5" /></button><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input className="w-64 pl-9" placeholder="Search businesses..." /></div></div>
    <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" /></button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">SA</div><div className="hidden sm:block"><p className="text-sm font-bold">Super Admin</p><p className="text-xs text-slate-400">Platform workspace</p></div></div>
  </header>
