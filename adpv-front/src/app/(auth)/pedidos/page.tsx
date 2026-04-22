'use client'
import { useState, useEffect } from 'react'
import { ShoppingCart, Eye, Filter, Search, Pencil, Trash2 } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'
import ModalPedido from '@/src/components/ModalPedido'

interface ProdutoVariacao {
  Id: number
  Tamanho: string
  ValorVenda: number
  Quantidade: number
}

interface Produto {
  Id: number
  Nome: string
  Variacoes: ProdutoVariacao[]
}

interface Pedido {
  Id: number
  Cliente: string
  Data: string
  ValorTotal: number
  Status: string
}

interface ItemPedido {
  ProdutoId: number
  ProdutoNome: string
  Quantidade: number
  ValorUnitario: number
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null)

  const carregarPedidos = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5145/api/Pedido', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const dados = await res.json()
        setPedidos(dados)
      }
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err)
    } finally {
      setLoading(false)
    }
  }

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5145/api/Produto/listar', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const dados = await res.json()
        setProdutos(dados)
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
    }
  }

  useEffect(() => {
    carregarPedidos()
    carregarProdutos()
  }, [])

  const handleEditar = async (pedido: Pedido) => {
    // Busca os itens do pedido
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5145/api/Pedido/${pedido.Id}/itens`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const itens = await res.json()
        //@ts-ignore
        pedido.Itens = itens
      }
    } catch (err) {
      console.error("Erro ao buscar itens:", err)
    }
    //@ts-ignore
    setPedidoEditando(pedido)
    setShowModal(true)
  }

  const handleExcluir = async (pedido: Pedido) => {
    if (!confirm(`Tem certeza que deseja excluir o pedido #${pedido.Id}?`)) {
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5145/api/Pedido/${pedido.Id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        alert('Pedido excluído com sucesso!')
        carregarPedidos()
      } else {
        const data = await res.json()
        alert('Erro ao excluir: ' + (data.message || 'Erro desconhecido'))
      }
    } catch (err) {
      console.error("Erro ao excluir pedido:", err)
      alert('Erro ao excluir pedido.')
    }
  }

  const handleFecharModal = () => {
    setShowModal(false)
    setPedidoEditando(null)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Pedidos</h1>
          <p className="text-sm text-slate-400">Gerencie as saídas e vendas do seu estoque.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#EF5B25] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-orange-200"
        >
          <ShoppingCart size={20} /> Novo Pedido
        </button>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar pedido por cliente ou ID..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-semibold text-sm border border-slate-200 rounded-xl hover:bg-slate-50">
          <Filter size={18} /> Filtrar
        </button>
      </div>

      <ChartCard title="Histórico de Vendas">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                <th className="pb-4 px-4">ID</th>
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Data</th>
                <th className="pb-4">Total</th>
                <th className="pb-4 text-center">Status</th>
                <th className="pb-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pedidos.filter(p => p != null).map((p) => (
                <tr key={p.Id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-4 font-mono text-xs text-slate-400">#{p.Id}</td>
                  <td className="py-4 font-bold text-slate-700">{p.Cliente}</td>
                  <td className="py-4 text-slate-500 text-sm">{p.Data}</td>
                  <td className="py-4 font-black text-slate-800">R$ {(p.ValorTotal ?? 0).toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      p.Status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {p.Status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEditar(p)}
                        className="p-2 text-slate-300 hover:text-[#EF5B25] transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleExcluir(p)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && !loading && (
            <p className="text-center py-10 text-slate-400 italic">Nenhum pedido encontrado.</p>
          )}
        </div>
      </ChartCard>

      {/* Modal de Novo Pedido / Edição */}
      {showModal && (
        <ModalPedido
          isOpen={showModal}
          onClose={handleFecharModal}
          onSucesso={() => { carregarPedidos(); handleFecharModal() }}
          produtos={produtos}
          pedido={pedidoEditando}
        />
      )}
    </div>
  )
}