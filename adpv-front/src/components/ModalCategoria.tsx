'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Categoria {
  Id: number
  Nome: string
  Codigo: string
  Descricao: string
}

interface ModalCategoriaProps {
  isOpen: boolean
  onClose: () => void
  onSucesso: () => void
  categoria?: Categoria | null
}

export default function ModalCategoria({ isOpen, onClose, onSucesso, categoria }: ModalCategoriaProps) {
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNome('')
      setCodigo('')
      setDescricao('')
    } else if (categoria) {
      // Populate form when editing
      setNome(categoria.Nome)
      setCodigo(categoria.Codigo)
      setDescricao(categoria.Descricao)
    }
  }, [isOpen, categoria])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token não encontrado. Faça login novamente.')
      return
    }

    const categoriaData = {
      Id: categoria?.Id || 0,
      Nome: nome,
      Codigo: codigo,
      Descricao: descricao
    }

    try {
      const url = categoria
        ? `http://localhost:5145/api/Tipo/${categoria.Id}`
        : 'http://localhost:5145/api/Tipo'
      const method = categoria ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoriaData)
      })

      const data = await res.json()
      if (res.ok) {
        alert(categoria ? 'Categoria atualizada com sucesso!' : 'Categoria cadastrada com sucesso!')
        onSucesso()
        onClose()
      } else {
        alert('Erro ao salvar: ' + (data.message || 'Erro desconhecido'))
      }
    } catch (err) {
      console.error(err)
      alert('Erro na requisição: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {categoria ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Nome da Categoria */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Categoria</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Eletrônicos"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
              required
            />
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Código da Categoria</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: CAT-001"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição da categoria..."
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-3 bg-[#EF5B25] text-white font-bold rounded-xl hover:bg-[#d44d1d] transition-all shadow-lg shadow-orange-100">
              {categoria ? 'Atualizar' : 'Salvar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
