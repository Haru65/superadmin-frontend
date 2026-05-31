import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyPoint } from '@/types/superadmin'
export const OrdersChart = ({ data }: { data: MonthlyPoint[] }) => <ResponsiveContainer width="100%" height={250}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
