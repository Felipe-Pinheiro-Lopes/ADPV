'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Save } from 'lucide-react'

interface ModalProps {
  onClose: () => void;
  onSucesso: () => void;
}

export default function ModalNovoProduto({ onClose, onSucesso }: ModalProps) {
  // Estados dos campos principais do Produto
  const [nome, setNome] = useState('')
  const [tipoId, setTipoId] = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  
  // Listas para os Selects
  const [categorias, setCategorias] = useState([])
  const [fornecedores, setFornecedores] = useState([])

  // Lista dinâmica de variações
  const [variacoes, setVariacoes] = useState([
    { tamanho: '', valorCompra: 0, valorVenda: 0, quantidade: 0 }
  ])

  // Busca dados iniciais para os Selects
  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }

    fetch('http://localhost:5145/api/Tipo', { headers }).then(res => res.json()).then(setCategorias)
    fetch('http://localhost:5145/api/Fornecedor', { headers }).then(res => res.json()).then(setFornecedores)
  }, [])

  const adicionarLinha = () => {
    setVariacoes([...variacoes, { tamanho: '', valorCompra: 0, valorVenda: 0, quantidade: 0 }])
  }

  const atualizarLinha = (index: number, campo: string, valor: any) => {
    const novas = [...variacoes]
    novas[index] = { ...novas[index], [campo]: valor }
    setVariacoes(novas)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    const payload = {
      nome,
      tipoId: parseInt(tipoId),
      fornecedorId: parseInt(fornecedorId),
      variacoes
    }

    const res = await fetch('http://localhost:5145/api/Produto/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      onSucesso()
      onClose()
    } else {
      alert("Erro ao cadastrar produto. Verifique os dados.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 border border-gray-100">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1e1b4b]">Cadastrar Novo Produto</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="space-y-8 text-black">
          {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Item</label>
              <input 
                type="text" value={nome} onChange={e => setNome(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none" 
                placeholder="Ex: Camiseta Oversized" required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
              <select 
                value={tipoId} onChange={e => setTipoId(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#EF5B25]" required
              >
                <option value="">Selecione...</option>
                {categorias.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fornecedor</label>
              <select 
                value={fornecedorId} onChange={e => setFornecedorId(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#EF5B25]" required
              >
                <option value="">Selecione...</option>
                {fornecedores.map((f: any) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
          </div>

          {/* SEÇÃO 2: ESTOQUE E PREÇOS DINÂMICOS */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1e1b4b] text-lg">Variações de Tamanho</h3>
              <button 
                type="button" onClick={adicionarLinha} 
                className="text-sm bg-orange-50 text-[#EF5B25] px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-100 transition-all"
              >
                <Plus size={18} /> Adicionar Grade
              </button>
            </div>

            <div className="space-y-4">
              {variacoes.map((v, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-2xl items-end animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tamanho</label>
                    <input 
                      type="text" placeholder="Ex: G" value={v.tamanho} 
                      onChange={e => atualizarLinha(index, 'tamanho', e.target.value)} 
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:bg-white" required 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Estoque Inicial</label>
                    <input 
                      type="number" value={v.quantidade} 
                      onChange={e => atualizarLinha(index, 'quantidade', parseInt(e.target.value))} 
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:bg-white" required 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">R$ Compra</label>
                    <input 
                      type="number" step="0.01" value={v.valorCompra} 
                      onChange={e => atualizarLinha(index, 'valorCompra', parseFloat(e.target.value))} 
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:bg-white" required 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">R$ Venda</label>
                    <input 
                      type="number" step="0.01" value={v.valorVenda} 
                      onChange={e => atualizarLinha(index, 'valorVenda', parseFloat(e.target.value))} 
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:bg-white" required 
                    />
                  </div>
                  <div className="flex justify-center">
                    <button 
                      type="button" 
                      onClick={() => setVariacoes(variacoes.filter((_, i) => i !== index))} 
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      disabled={variacoes.length === 1}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#EF5B25] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#d44d1d] shadow-xl shadow-orange-100 transition-all transform hover:-translate-y-0.5"
          >
            <Save size={22} /> Finalizar Cadastro de Produto
          </button>
        </form>
      </div>
    </div>
  )
}