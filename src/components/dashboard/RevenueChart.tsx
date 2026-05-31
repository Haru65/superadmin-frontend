import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyPoint } from '@/types/superadmin'
import { formatCurrency } from '@/utils/formatCurrency'

export const RevenueChart = ({ data }: { data: MonthlyPoint[] }) => <ResponsiveContainer width="100%" height={250}><AreaChart data={data}><defs><linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#1687d9" stopOpacity={0.35} /><stop offset="95%" stopColor="#1687d9" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Area type="monotone" dataKey="revenue" stroke="#1687d9" fill="url(#revenue)" strokeWidth={3} /></AreaChart></ResponsiveContainer>
