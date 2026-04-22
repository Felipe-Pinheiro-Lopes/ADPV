'use client' // Todo gráfico interativo precisa ser client-side
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Definimos o formato de cada ponto do gráfico que vem do C#
interface StockData {
  name: string;      // Ex: "Seg", "Ter"
  entradas: number;
  saidas: number;
}

// O componente agora recebe "data" como uma propriedade (prop)
interface StockMovementChartProps {
  data?: StockData[]; 
}

export function StockMovementChart({ data }: StockMovementChartProps) {
  if (!data) return <div className="h-full flex items-center justify-center text-slate-300">Sem dados</div>;
  return (
    // ResponsiveContainer faz o gráfico ocupar todo o espaço do ChartCard pai
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Grid leve ao fundo */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        
        {/* Eixos */}
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        
        {/* Tooltip (o que aparece ao passar o mouse) */}
        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />

        {/* As áreas coloridas */}
        <Area type="monotone" dataKey="entradas" stroke="#6366f1" fillOpacity={1} fill="url(#colorEntradas)" />
        <Area type="monotone" dataKey="saidas" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSaidas)" />

        {/* Definição do degradê (gradiente) das cores */}
        <defs>
          <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
}