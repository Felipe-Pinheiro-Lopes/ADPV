'use client'
import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'
import ModalCategoria from '@/src/components/ModalCategoria'

interface Categoria {
  Id: number
  Nome: string
  Codigo: string
  Descricao: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)

  const carregarCategorias = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5145/api/Tipo', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setCategorias(data)
      }
    } catch (err) {
      console.error("Erro ao buscar categorias:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  const handleEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria)
    setShowModal(true)
  }

  const handleExcluir = async (categoria: Categoria) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoria.Nome}"?`)) {
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5145/api/Tipo/${categoria.Id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        alert('Categoria excluída com sucesso!')
        carregarCategorias()
      } else {
        const data = await res.json()
        alert('Erro ao excluir: ' + (data.message || 'Erro desconhecido'))
      }
    } catch (err) {
      console.error("Erro ao excluir categoria:", err)
      alert('Erro ao excluir categoria.')
    }
  }

  const handleFecharModal = () => {
    setShowModal(false)
    setCategoriaEditando(null)
  }

  const categoriasFiltradas = categorias.filter(c =>
    c.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.Codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Categorias</h1>
          <p className="text-sm text-slate-400">Gerencie os tipos de produtos organizados no seu inventário.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#EF5B25] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-orange-200"
        >
          <PlusCircle size={20} /> Nova Categoria
        </button>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar categoria por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm"
          />
        </div>
      </div>

      <ChartCard title="Categorias Cadastradas">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                <th className="pb-4 px-4">Código</th>
                <th className="pb-4">Nome</th>
                <th className="pb-4">Descrição</th>
                <th className="pb-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categoriasFiltradas.map((cat) => (
                <tr key={cat.Id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-4 font-mono text-xs text-[#EF5B25] font-bold tracking-tight">{cat.Codigo}</td>
                  <td className="py-4 font-bold text-slate-700">{cat.Nome}</td>
                  <td className="py-4 text-slate-500 text-sm max-w-[300px] truncate">{cat.Descricao}</td>
                  <td className="py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEditar(cat)}
                        className="text-slate-300 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(cat)}
                        className="text-slate-300 hover:text-red-600 transition-colors"
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
          {categoriasFiltradas.length === 0 && !loading && (
            <p className="text-center py-10 text-slate-400 italic">
              {searchTerm ? 'Nenhuma categoria encontrada para a busca.' : 'Nenhuma categoria cadastrada.'}
            </p>
          )}
        </div>
      </ChartCard>

      {/* Modal de Criar/Editar Categoria */}
      {showModal && (
        <ModalCategoria
          isOpen={showModal}
          onClose={handleFecharModal}
          onSucesso={() => { carregarCategorias(); handleFecharModal() }}
          categoria={categoriaEditando}
        />
      )}
    </div>
  )
}
