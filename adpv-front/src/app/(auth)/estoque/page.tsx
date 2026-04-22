'use client'
import { useState, useEffect, useMemo } from 'react'
import ModalProduto from '@/src/components/ModalProduto' 
import { Plus, Pencil, Trash2, Package, Search, AlertCircle } from 'lucide-react'

interface Produto {
  Id: number;
  Nome: string;
  TipoNome?: string;
  FornecedorNome?: string;
  Variacoes: Array<{ Id: number; Tamanho: string; ValorVenda: number; Quantidade: number }>;
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('') 
  const [showModal, setShowModal] = useState(false)
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null)

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const carregarDados = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5145/api/Produto/listar', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const dados = await res.json()
        setProdutos(dados)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  const excluirProduto = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o produto "${nome}"?`)) {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`http://localhost:5145/api/Produto/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.ok) {
          setProdutos(produtos.filter((p) => p.Id !== id))
        } else {
          alert("Não foi possível excluir o produto. Verifique se ele possui dependências.")
        }
      } catch (error) {
        console.error("Erro ao excluir:", error)
      }
    }
  }

   const produtosFiltrados = useMemo(() => {
     return produtos.filter((p) => 
       p.Nome.toLowerCase().includes(busca.toLowerCase()) ||
       (p.TipoNome && p.TipoNome.toLowerCase().includes(busca.toLowerCase()))
     )
   }, [busca, produtos])

  useEffect(() => { carregarDados() }, [])

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900"> 
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1e1b4b] tracking-tight">Estoque</h1>
              <p className="text-slate-500 font-medium mt-1">Controle total dos seus produtos e variações.</p>
            </div>
            <button 
              onClick={() => { setProdutoParaEditar(null); setShowModal(true); }}
              className="bg-[#EF5B25] text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d44d1d] shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              <Plus size={22} strokeWidth={3} /> Novo Produto
            </button>
          </div>

          {/* Barra de Busca */}
          <div className="relative mb-8 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#EF5B25] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Pesquisar por nome do material ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-3xl shadow-sm outline-none focus:border-[#EF5B25] focus:ring-4 focus:ring-orange-50 transition-all text-lg font-medium"
            />
          </div>

          {/* Tabela / Lista */}
          <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-slate-400 text-[12px] uppercase font-black tracking-[0.1em]">
                  <th className="px-8 py-6">Informações do Produto</th>
                  <th className="px-8 py-6">Grade de Tamanhos & Preços</th>
                  <th className="px-8 py-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((prod) => (
                    <tr key={prod.Id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-orange-100/50 rounded-[22px] flex items-center justify-center text-[#EF5B25] group-hover:scale-110 transition-transform">
                              <Package size={32} />
                          </div>
                             <div>
                               <div className="font-bold text-[#1e1b4b] text-2xl mb-1">{prod.Nome}</div>
                               <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                 {prod.TipoNome || "Geral"}
                               </span>
                             </div>
                        </div>
                      </td>
                      <td className="px-8 py-10">
                        <div className="flex flex-wrap gap-3">
                          {prod.Variacoes && prod.Variacoes.length > 0 ? (
                            prod.Variacoes.map((v) => (
                              <div key={v.Id} className="bg-white border border-slate-200 pl-4 pr-5 py-3 rounded-2xl flex items-center gap-5 shadow-sm hover:border-orange-200 transition-colors">
                                <span className="font-black text-[#EF5B25] text-lg">{v.Tamanho}</span>
                                <div className="h-8 w-[1px] bg-slate-100"></div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-slate-400 font-black uppercase">Venda</span>
                                  <span className="text-sm font-bold text-emerald-600">{formatarMoeda(v.ValorVenda)}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-slate-400 font-black uppercase">Qtd</span>
                                  <span className="text-sm font-bold text-slate-700">{v.Quantidade} <small className="text-slate-400 font-medium">un</small></span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-300 italic text-sm">Nenhuma variação cadastrada</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-10">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => { setProdutoParaEditar(prod); setShowModal(true); }} 
                            className="bg-white text-slate-400 p-3 rounded-xl border border-slate-100 hover:text-[#EF5B25] hover:border-orange-100 hover:shadow-md transition-all"
                            title="Editar"
                          >
                            <Pencil size={20} />
                          </button>
                          <button 
                            onClick={() => excluirProduto(prod.Id, prod.Nome)}
                            className="bg-white text-slate-400 p-3 rounded-xl border border-slate-100 hover:text-red-500 hover:border-red-100 hover:shadow-md transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-300">
                        <AlertCircle size={48} />
                        <span className="text-xl font-medium">Nenhum produto encontrado.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <ModalProduto 
          onClose={() => { setShowModal(false); setProdutoParaEditar(null); }} 
          onSucesso={() => carregarDados()} 
          dadosEdicao={produtoParaEditar}
        />
      )}
    </div>
  )
}