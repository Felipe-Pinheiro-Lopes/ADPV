'use client'
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { TrendingUp, Package, DollarSign } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'
import { SummaryCard } from '@/src/components/SummaryCard'

interface ProdutoMaisVendido {
  ProdutoId: number
  ProdutoNome: string
  QuantidadeVendida: number
  ValorTotal: number
}

export default function ProdutosMaisVendidosPage() {
  const [produtos, setProdutos] = useState<ProdutoMaisVendido[]>([])
  const [loading, setLoading] = useState(true)
  const [limite, setLimite] = useState(10)
  const [autorizado, setAutorizado] = useState(false)
  const router = useRouter()

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5145/api/Dashboard/produtos-mais-vendidos?limite=${limite}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setProdutos(data)
      }
    } catch (err) {
      console.error("Erro ao carregar produtos mais vendidos:", err)
    } finally {
      setLoading(false)
    }
  }

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
      carregarProdutos()
    } catch {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }, [router, limite])

  const totalVendido = produtos.reduce((sum, p) => sum + p.QuantidadeVendida, 0)
  const valorTotalGeral = produtos.reduce((sum, p) => sum + p.ValorTotal, 0)

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
          <h1 className="text-2xl font-black text-slate-800">Produtos Mais Vendidos</h1>
          <p className="text-sm text-slate-400">Ranking de produtos com maior volume de vendas.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#EF5B25] outline-none"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          label="Total de Produtos"
          value={produtos.length}
          icon={<Package size={20} />}
        />
        <SummaryCard
          label="Unidades Vendidas"
          value={totalVendido}
          icon={<TrendingUp size={20} />}
        />
        <SummaryCard
          label="Valor Total"
          value={`R$ ${valorTotalGeral.toFixed(2)}`}
          icon={<DollarSign size={20} />}
        />
      </div>

      {/* Tabela de Produtos */}
      <ChartCard title="Ranking de Vendas">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                <th className="pb-4 px-4">Pos.</th>
                <th className="pb-4">Produto</th>
                <th className="pb-4 text-center">Qtd. Vendida</th>
                <th className="pb-4 text-right">Valor Total</th>
                <th className="pb-4 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {produtos.map((p, index) => {
                const percentual = totalVendido > 0 ? ((p.QuantidadeVendida / totalVendido) * 100).toFixed(1) : '0.0'
                return (
                  <tr key={p.ProdutoId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-700">{p.ProdutoNome}</td>
                    <td className="py-4 text-center">
                      <span className="font-mono text-sm text-slate-600">{p.QuantidadeVendida} un.</span>
                    </td>
                    <td className="py-4 text-right font-black text-slate-800">
                      R$ {p.ValorTotal.toFixed(2)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-[#EF5B25] h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">{percentual}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {produtos.length === 0 && !loading && (
            <p className="text-center py-10 text-slate-400 italic">Nenhum produto vendido ainda.</p>
          )}
        </div>
      </ChartCard>
    </div>
  )
}
