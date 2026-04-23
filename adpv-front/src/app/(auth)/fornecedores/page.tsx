'use client'
import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'
import ModalFornecedor from '@/src/components/ModalFornecedor'

interface Fornecedor {
  Id: number
  Nome: string
  Cnpj: string
  Contato: string
  Telefone: string
  Email: string
  Endereco: string
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null)

  const carregarFornecedores = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5145/api/Fornecedor', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const dados = await res.json()
        setFornecedores(dados)
      }
    } catch (err) {
      console.error("Erro ao buscar fornecedores:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarFornecedores()
  }, [])

  const handleEditar = (fornecedor: Fornecedor) => {
    setFornecedorEditando(fornecedor)
    setShowModal(true)
  }

  const handleExcluir = async (fornecedor: Fornecedor) => {
    if (!confirm(`Tem certeza que deseja excluir o fornecedor "${fornecedor.Nome}"?`)) {
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5145/api/Fornecedor/${fornecedor.Id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        alert('Fornecedor excluído com sucesso!')
        carregarFornecedores()
      } else {
        const data = await res.json()
        alert('Erro ao excluir: ' + (data.message || 'Erro desconhecido'))
      }
    } catch (err) {
      console.error("Erro ao excluir fornecedor:", err)
      alert('Erro ao excluir fornecedor.')
    }
  }

  const handleFecharModal = () => {
    setShowModal(false)
    setFornecedorEditando(null)
  }

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.Cnpj.includes(searchTerm) ||
    f.Email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Fornecedores</h1>
          <p className="text-sm text-slate-400">Gerencie seus parceiros comerciais e fornecedores.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#EF5B25] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-orange-200"
        >
          <Plus size={20} /> Novo Fornecedor
        </button>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar fornecedor por nome, CNPJ ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm"
          />
        </div>
      </div>

      <ChartCard title="Lista de Fornecedores">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                <th className="pb-4 px-4">ID</th>
                <th className="pb-4">Empresa</th>
                <th className="pb-4">CNPJ</th>
                <th className="pb-4">Contato</th>
                <th className="pb-4">Telefone</th>
                <th className="pb-4">E-mail</th>
                <th className="pb-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fornecedoresFiltrados.map((f) => (
                <tr key={f.Id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-4 font-mono text-xs text-slate-400">#{f.Id}</td>
                  <td className="py-4 font-bold text-slate-700">{f.Nome}</td>
                  <td className="py-4 text-slate-500 text-sm">{f.Cnpj}</td>
                  <td className="py-4 text-slate-600">{f.Contato}</td>
                  <td className="py-4 text-slate-500 text-sm">{f.Telefone}</td>
                  <td className="py-4 text-slate-500 text-sm">{f.Email}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEditar(f)}
                        className="p-2 text-slate-300 hover:text-[#EF5B25] transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(f)}
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
          {fornecedoresFiltrados.length === 0 && !loading && (
            <p className="text-center py-10 text-slate-400 italic">
              {searchTerm ? 'Nenhum fornecedor encontrado para a busca.' : 'Nenhum fornecedor cadastrado.'}
            </p>
          )}
        </div>
      </ChartCard>

      {/* Modal de Criar/Editar Fornecedor */}
      {showModal && (
        <ModalFornecedor
          isOpen={showModal}
          onClose={handleFecharModal}
          onSucesso={() => { carregarFornecedores(); handleFecharModal() }}
          fornecedor={fornecedorEditando}
        />
      )}
    </div>
  )
}
