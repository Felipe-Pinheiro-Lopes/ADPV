'use client'
import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Array<{Id: number; Nome: string; Codigo: string; Descricao: string}>>([])
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')

  const carregarCategorias = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:5145/api/Tipo', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setCategorias(data)
    }
  }

  useEffect(() => { 
    carregarCategorias()
  }, [])

  const salvarCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:5145/api/Tipo', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ Nome: nome, Codigo: codigo, Descricao: descricao })
    })

    if (res.ok) {
      setNome(''); setCodigo(''); setDescricao('');
      carregarCategorias()
    }
  }

  const excluirCategoria = async (id: number) => {
    if (!confirm('Excluir esta categoria?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5145/api/Tipo/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) carregarCategorias()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e1b4b]">Cadastro de Categorias</h1>
        <p className="text-gray-500">Gerencie os tipos de produtos organizados no seu inventário.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Nova Categoria</h2>
          <form onSubmit={salvarCategoria} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
              <input 
                value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Eletrônicos"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código da Categoria</label>
              <input 
                value={codigo} onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: CAT-001"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                value={descricao} onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição da categoria..."
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black resize-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#EF5B25] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d44d1d] transition-all shadow-lg shadow-orange-100"
            >
              <PlusCircle size={20} />
              Salvar Categoria
            </button>
          </form>
        </div>

        {/* COLUNA DIREITA: LISTAGEM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfdff]">
            <h2 className="text-lg font-bold text-gray-800">Categorias Cadastradas</h2>
            <span className="bg-orange-50 text-[#EF5B25] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {categorias.length} Categorias
            </span>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-black">
              {categorias.map((cat) => (
                <tr key={cat.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-[#EF5B25] font-bold text-sm tracking-tight">{cat.Codigo}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{cat.Nome}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm max-w-[200px] truncate">{cat.Descricao}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={18} /></button>
                      <button 
                        onClick={() => excluirCategoria(cat.Id)} 
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center border-t border-gray-50 bg-[#fcfdff]">
            <button className="text-[#EF5B25] text-sm font-bold hover:underline">Ver todas as categorias →</button>
          </div>
        </div>

      </div>
    </div>
  )
}