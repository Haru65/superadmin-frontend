import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { clearToken } from '@/utils/auth'

export const SuperAdminLayout = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const unauthorized = () => { clearToken(); navigate('/login') }
    window.addEventListener('logdine:unauthorized', unauthorized)
    return () => window.removeEventListener('logdine:unauthorized', unauthorized)
  }, [navigate])
  return <div className="min-h-screen bg-slate-50"><Sidebar open={open} onClose={() => setOpen(false)} /><div className="lg:pl-72"><Header onMenu={() => setOpen(true)} /><main className="p-4 lg:p-8"><Outlet /></main></div></div>
}
