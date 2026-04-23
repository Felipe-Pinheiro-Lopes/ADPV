'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { FileText, Download, TrendingUp, Package, DollarSign, ShoppingBag, AlertCircle, BarChart3, RefreshCw } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'
import { SummaryCard } from '@/src/components/SummaryCard'
import { StockMovementChart } from '@/src/components/charts/StockMovementChart'
import { CategoryDistributionChart } from '@/src/components/charts/CategoryDistributionChart'
import { RecentActivitiesTable } from '@/src/components/RecentActivitiesTable'

interface DashboardData {
  totalProdutos: number
  estoqueBaixo: number
  pedidosPendentes: number
  patrimonio: number
  previsao: number
  categorias: Array<{ name: string; value: number }>
  porFornecedor: Array<{ name: string; value: number }>
  movimentacoes: Array<{ name: string; entradas: number; saidas: number }>
  atividadesRecentes: Array<{ id: number; item: string; type: string; qty: number; status: string; date: string }>
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [periodo, setPeriodo] = useState('7dias')
  const [autorizado, setAutorizado] = useState(false)
  const router = useRouter()

  const carregarDados = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    else setRefreshing(true)
    try {
      const token = localStorage.getItem('token')
      
      // Calcular datas baseadas no período selecionado
      const hoje = new Date()
      const dataInicio = new Date()
      const dataFim = new Date()

      switch (periodo) {
        case '7dias':
          dataInicio.setDate(hoje.getDate() - 6)
          dataFim.setDate(hoje.getDate() + 1)
          break
        case '30dias':
          dataInicio.setDate(hoje.getDate() - 29)
          dataFim.setDate(hoje.getDate() + 1)
          break
        case '90dias':
          dataInicio.setDate(hoje.getDate() - 89)
          dataFim.setDate(hoje.getDate() + 1)
          break
        default:
          dataInicio.setDate(hoje.getDate() - 6)
          dataFim.setDate(hoje.getDate() + 1)
      }

      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString().split('T')[0],
        dataFim: dataFim.toISOString().split('T')[0]
      })

      const res = await fetch(`http://localhost:5145/api/Dashboard/resumo?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setDados(data)
      }
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [periodo])

  // Efeito de validação de_token (executa uma vez)
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<{exp: number; role?: string; "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string}>(token)
      
      const agora = Date.now() / 1000
      if (decoded.exp < agora) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role
      
      if (role !== 'Admin') {
        router.push('/dashboard')
        return
      }

      setAutorizado(true)
    } catch {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }, [router])

  // Efeito para carregar dados quando autorizado ou periodo mudar
  useEffect(() => {
    if (autorizado) {
      carregarDados()
    }
  }, [autorizado, periodo, carregarDados])

  const handleRefresh = () => {
    carregarDados(false)
  }

  // Cálculos derivados
  const TicketMedio = dados?.totalProdutos && dados.totalProdutos > 0
    ? (dados.previsao / dados.totalProdutos).toFixed(2)
    : '0.00'

  const handleExportar = async (tipo: 'estoque' | 'vendas', formato: 'csv' | 'excel') => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token não encontrado. Faça login novamente.')
      return
    }

    try {
      const endpoint = tipo === 'estoque'
        ? `http://localhost:5145/api/Dashboard/exportar/estoque?formato=${formato}`
        : `http://localhost:5145/api/Dashboard/exportar/vendas?formato=${formato}`

      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const extension = formato === 'excel' ? 'xlsx' : 'csv'
        const mimeType = formato === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
        const tipoNome = tipo === 'estoque' ? 'estoque' : 'vendas'
        a.download = `relatorio_${tipoNome}_${new Date().toISOString().split('T')[0]}.${extension}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Erro ao gerar relatório. Tente novamente.')
      }
    } catch (err) {
      console.error('Erro ao exportar:', err)
      alert('Erro ao gerar relatório.')
    }
  }

  if (loading || !autorizado) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF5B25] mx-auto mb-4"></div>
          <p className="font-bold text-slate-600">Validando permissões de acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-[#FFF9F9] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Relatórios e Performance</h1>
          <p className="text-sm text-slate-400">Analise os números do seu negócio de forma simplificada.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#EF5B25] outline-none"
          >
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-[#EF5B25] outline-none disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Cards de Resumo com Dados Reais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Produtos"
          value={dados?.totalProdutos || 0}
          icon={<Package size={20} />}
        />
        <SummaryCard
          label="Estoque Baixo"
          value={dados?.estoqueBaixo || 0}
          variant="danger"
          icon={<AlertCircle size={20} />}
        />
        <SummaryCard
          label="Pedidos Pendentes"
          value={dados?.pedidosPendentes || 0}
          icon={<ShoppingBag size={20} />}
        />
        <SummaryCard
          label="Previsão Venda"
          value={`R$ ${(dados?.previsao || 0).toFixed(2)}`}
          icon={<DollarSign size={20} />}
        />
      </div>

      {/* Novos Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          label="Patrimônio (Custo)"
          value={`R$ ${(dados?.patrimonio || 0).toFixed(2)}`}
          icon={<BarChart3 size={20} />}
        />
        <SummaryCard
          label="Ticket Médio"
          value={`R$ ${TicketMedio}`}
          icon={<TrendingUp size={20} />}
        />
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Crescimento (estimado)</p>
            <p className="text-xl font-black text-slate-800">+14.2%</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Movimentação de Estoque">
            <StockMovementChart data={dados?.movimentacoes} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Distribuição por Categoria">
            <CategoryDistributionChart data={dados?.categorias} />
          </ChartCard>
        </div>
      </div>

      {/* Atividades Recentes */}
      <ChartCard title="Atividades Recentes">
        <RecentActivitiesTable data={dados?.atividadesRecentes} />
      </ChartCard>

      {/* Seção de Exportação com Funcionalidade Real */}
      <ChartCard title="Exportar Documentos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Estoque - CSV */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-blue-400 group-hover:text-blue-600" />
              <div>
                <p className="font-bold text-slate-700">Relatório de Estoque (CSV)</p>
                <p className="text-xs text-slate-400">Valores separados por vírgula</p>
              </div>
            </div>
            <button
              onClick={() => handleExportar('estoque', 'csv')}
              className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-all"
              title="Exportar estoque como CSV"
            >
              <Download size={20} />
            </button>
          </div>

          {/* Estoque - Excel */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-emerald-500 group-hover:text-emerald-600" />
              <div>
                <p className="font-bold text-slate-700">Relatório de Estoque (Excel)</p>
                <p className="text-xs text-slate-400">Planilha formatada .xlsx</p>
              </div>
            </div>
            <button
              onClick={() => handleExportar('estoque', 'excel')}
              className="p-2 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-all"
              title="Exportar estoque como Excel"
            >
              <Download size={20} />
            </button>
          </div>

          {/* Vendas - CSV */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-purple-500 group-hover:text-purple-600" />
              <div>
                <p className="font-bold text-slate-700">Fechamento de Vendas (CSV)</p>
                <p className="text-xs text-slate-400">Valores separados por vírgula</p>
              </div>
            </div>
            <button
              onClick={() => handleExportar('vendas', 'csv')}
              className="p-2 bg-purple-50 rounded-xl text-purple-600 hover:bg-purple-100 transition-all"
              title="Exportar vendas como CSV"
            >
              <Download size={20} />
            </button>
          </div>

          {/* Vendas - Excel */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-orange-500 group-hover:text-orange-600" />
              <div>
                <p className="font-bold text-slate-700">Fechamento de Vendas (Excel)</p>
                <p className="text-xs text-slate-400">Planilha formatada .xlsx</p>
              </div>
            </div>
            <button
              onClick={() => handleExportar('vendas', 'excel')}
              className="p-2 bg-orange-50 rounded-xl text-orange-600 hover:bg-orange-100 transition-all"
              title="Exportar vendas como Excel"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
