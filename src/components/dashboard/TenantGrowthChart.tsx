import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyPoint } from '@/types/superadmin'
export const TenantGrowthChart = ({ data }: { data: MonthlyPoint[] }) => <ResponsiveContainer width="100%" height={250}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="tenants" stroke="#8b5cf6" strokeWidth={3} /></LineChart></ResponsiveContainer>
