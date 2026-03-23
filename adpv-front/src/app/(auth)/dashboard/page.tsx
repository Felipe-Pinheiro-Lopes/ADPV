'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Package, AlertTriangle, DollarSign, TrendingUp, MoreHorizontal, Move } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts'

// --- MUDANÇA AQUI: NOVA ESTRATÉGIA DE IMPORTAÇÃO PARA TURBOPACK ---
// Usamos o dynamic para garantir que o código só execute no cliente.
// Adicionamos uma verificação manual para extrair o WidthProvider, 
// pois o Turbopack às vezes o coloca dentro da propriedade 'default'.
const ResponsiveGridLayout = dynamic(
  () => import('react-grid-layout').then((mod) => {
    // Tenta pegar de 'mod' ou de 'mod.default' (correção para Next.js 16/Turbopack)
    const WP = mod.WidthProvider || (mod as any).default?.WidthProvider;
    const R = mod.Responsive || (mod as any).default?.Responsive;
    
    if (typeof WP === 'function') {
      return WP(R);
    }
    // Fallback de segurança
    return R;
  }),
  { 
    ssr: false,
    loading: () => <div className="h-screen w-full flex items-center justify-center text-slate-400 font-medium">Carregando Layout...</div>
  }
);

// Estilos obrigatórios para o Drag & Drop e Resizable funcionar
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Componente de Card com alça de movimento (Drag Handle)
function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 drag-handle cursor-move">
        <div className="flex items-center gap-2">
          <Move className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={18} />
          <h3 className="text-lg font-bold text-[#1e1b4b]">{title}</h3>
        </div>
        <button className="text-slate-400 hover:bg-slate-50 p-2 rounded-xl transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="flex-1 min-h-0 w-full">
        {children}
      </div>
    </div>
  )
}

// Componente dos cards de resumo superiores
function SummaryCard({ icon, label, value, color, suffix = "", isCurrency = false, border = false }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-[#EF5B25]"
  }

  return (
    <div className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm ${border ? 'border-l-4 border-l-[#EF5B25]' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</span>
      <h2 className="text-3xl font-black text-[#1e1b4b] mt-1">
        {isCurrency ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : value}
        {suffix && <span className="text-sm font-medium text-red-400 ml-2">{suffix}</span>}
      </h2>
    </div>
  )
}

export default function Dashboard() {
  const [dados, setDados] = useState({ 
    totalProdutos: 0, 
    estoqueCritico: 0, 
    patrimonio: 0, 
    previsao: 0,
    porCategoria: [], 
    porFornecedor: [], 
    movimentacao: [] 
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    fetch('http://localhost:5145/api/Dashboard/resumo', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(apiData => {
      // Sincroniza os dados da API com o estado do Front
      setDados({
        totalProdutos: apiData.totalProdutos || 0,
        estoqueCritico: apiData.estoqueCritico || 0,
        patrimonio: apiData.patrimonio || 0,
        previsao: apiData.previsao || 0,
        porCategoria: apiData.porCategoria || [],
        porFornecedor: apiData.porFornecedor || [],
        movimentacao: apiData.movimentacao || []
      })
    })
    .catch(err => console.error("Erro dashboard:", err))
  }, [])

  // Definição das posições dos cards no grid
  const layouts = {
    lg: [
      { i: 'cat', x: 0, y: 0, w: 6, h: 10 },
      { i: 'forn', x: 6, y: 0, w: 6, h: 10 },
      { i: 'mov', x: 0, y: 10, w: 12, h: 10 }
    ]
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[#1e1b4b]">Resumo Operacional</h1>
        <p className="text-slate-400 font-medium">Status do seu inventário em tempo real.</p>
      </div>

      {/* Grid de Sumário (Estático) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard icon={<Package size={24}/>} label="Total Produtos" value={dados.totalProdutos} color="blue" />
        <SummaryCard icon={<AlertTriangle size={24}/>} label="Estoque Crítico" value={dados.estoqueCritico} color="red" suffix="itens" />
        <SummaryCard icon={<DollarSign size={24}/>} label="Patrimônio (Custo)" value={dados.patrimonio} color="emerald" isCurrency />
        <SummaryCard icon={<TrendingUp size={24}/>} label="Previsão Venda" value={dados.previsao} color="orange" isCurrency border />
      </div>

      {/* Grid Interativo (Drag & Drop) */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={30}
        draggableHandle=".drag-handle"
        margin={[24, 24]}
      >
        <div key="cat">
          <ChartCard title="Produtos por Categoria">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.porCategoria}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div key="forn">
          <ChartCard title="Distribuição por Fornecedor">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={dados.porFornecedor.length > 0 ? dados.porFornecedor : [{name: 'Sem dados', value: 1}]} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                >
                  {dados.porFornecedor.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {dados.porFornecedor.length === 0 && <Cell fill="#f1f5f9" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div key="mov">
          <ChartCard title="Movimentação de Estoque">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.movimentacao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}