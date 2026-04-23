'use client'
import { useState, useEffect } from 'react'
import { X, ShoppingCart, Plus, Trash2 } from 'lucide-react'

interface ItemPedido {
  produtoId: number
  produtoNome: string
  quantidade: number
  valorUnitario: number
  tamanhoId?: number
  tamanhoNome?: string
}

interface Pedido {
  Id: number
  Cliente: string
  Data: string
  ValorTotal: number
  Status: string
  Itens?: Array<{ ProdutoId: number; ProdutoNome: string; Quantidade: number; ValorUnitario: number; TamanhoId?: number; TamanhoNome?: string }>
}

interface ModalPedidoProps {
  isOpen: boolean
  onClose: () => void
  onSucesso: () => void
  produtos: Array<{ Id: number; Nome: string; Variacoes: Array<{ Id: number; Tamanho: string; ValorVenda: number; Quantidade: number }> }>
  pedido?: Pedido | null
}

export default function ModalPedido({ isOpen, onClose, onSucesso, produtos, pedido }: ModalPedidoProps) {
  const [cliente, setCliente] = useState('')
  const [itens, setItens] = useState<ItemPedido[]>([{
    produtoId: 0,
    produtoNome: '',
    quantidade: 1,
    valorUnitario: 0,
    tamanhoId: undefined,
    tamanhoNome: ''
  }])
  const [status, setStatus] = useState('Pendente')

  useEffect(() => {
    if (!isOpen) {
      setCliente('')
      setItens([{ produtoId: 0, produtoNome: '', quantidade: 1, valorUnitario: 0, tamanhoId: undefined, tamanhoNome: '' }])
      setStatus('Pendente')
    } else if (pedido) {
      setCliente(pedido.Cliente)
      setStatus(pedido.Status)
      if (pedido.Itens && pedido.Itens.length > 0) {
        setItens(pedido.Itens.map(item => ({
          produtoId: item.ProdutoId,
          produtoNome: item.ProdutoNome,
          quantidade: item.Quantidade,
          valorUnitario: item.ValorUnitario,
          tamanhoId: item.TamanhoId,
          tamanhoNome: item.TamanhoNome
        })))
      }
    }
  }, [isOpen, pedido])

const handleProdutoChange = (index: number, produtoId: number) => {
    const produto = produtos.find(p => p.Id === produtoId)
    if (!produto) {
      const novosItens = [...itens]
      novosItens[index] = { ...novosItens[index], produtoId: 0, produtoNome: '', valorUnitario: 0, tamanhoId: undefined, tamanhoNome: '' }
      setItens(novosItens)
      return
    }

    const temVariacoes = produto.Variacoes && produto.Variacoes.length > 0
    const primeiroVar = produto.Variacoes?.[0] as any

    const novosItens = [...itens]
    novosItens[index] = {
      produtoId,
      produtoNome: produto.Nome,
      quantidade: 1, // reseta quantidade ao mudar produto
      valorUnitario: primeiroVar ? Number(primeiroVar.ValorVenda) : 0,
      tamanhoId: temVariacoes ? undefined : primeiroVar?.Id,
      tamanhoNome: temVariacoes ? '' : primeiroVar?.Tamanho
    }
setItens(novosItens)
  }

  const handleTamanhoChange = (index: number, tamanhoId: number) => {
    if (tamanhoId === 0) {
      const novosItens = [...itens]
      novosItens[index] = {
        ...novosItens[index],
        tamanhoId: undefined,
        tamanhoNome: '',
        valorUnitario: 0
      }
      setItens(novosItens)
      return
    }
    
    const item = itens[index]
    const produto = produtos.find(p => p.Id === item.produtoId)
    if (!produto || !produto.Variacoes) return

    const variacao = produto.Variacoes.find(v => v.Id === tamanhoId)
    if (!variacao) return

    const novosItens = [...itens]
    novosItens[index] = {
      ...novosItens[index],
      tamanhoId: variacao.Id,
      tamanhoNome: variacao.Tamanho,
      valorUnitario: Number(variacao.ValorVenda)
    }
    setItens(novosItens)
  }

  const handleQuantidadeChange = (index: number, quantidade: number) => {
    if (quantidade < 1) return
    const novosItens = [...itens]
    novosItens[index].quantidade = quantidade
    setItens(novosItens)
  }

  const addItem = () => {
    setItens([...itens, { produtoId: 0, produtoNome: '', quantidade: 1, valorUnitario: 0, tamanhoId: undefined, tamanhoNome: '' }])
  }

  const removeItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index))
    }
  }

  const calcularTotal = () => {
    return itens.reduce((sum, item) => {
      const valor = (item.valorUnitario ?? 0)
      return sum + (valor * item.quantidade)
    }, 0)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token não encontrado. Faça login novamente.')
      return
    }

    const valorTotal = calcularTotal()
    if (!pedido && valorTotal <= 0) {
      alert('O pedido deve ter pelo menos um item com valor maior que zero.')
      return
    }

    const payload: any = {
      Cliente: cliente,
      ValorTotal: valorTotal,
      Status: status
    }

    // Sempre envia os itens, tanto para novo quanto para edição
    const itensValidos = itens.filter(i => i.produtoId > 0)
    if (itensValidos.length === 0 && !pedido) {
      alert('Selecione pelo menos um produto.')
      return
    }
    if (itensValidos.length > 0) {
      payload.Itens = itensValidos.map(item => ({
        ProdutoId: item.produtoId,
        Quantidade: item.quantidade,
        ValorUnitario: item.valorUnitario,
        TamanhoId: item.tamanhoId
      }))
    }

    try {
      let res
      if (pedido) {
        res = await fetch(`http://localhost:5145/api/Pedido/${pedido.Id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('http://localhost:5145/api/Pedido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      }

      const data = await res.json()
      if (res.ok) {
        alert(pedido ? 'Pedido atualizado com sucesso!' : 'Pedido criado com sucesso!')
        onSucesso()
        onClose()
      } else {
        alert('Erro ao salvar pedido: ' + (data.message || JSON.stringify(data)))
      }
    } catch (err: any) {
      console.error(err)
      alert('Erro na requisição: ' + err.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{pedido ? 'Editar Pedido' : 'Novo Pedido'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
            <input
              type="text"
              placeholder="Nome do cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5B25] focus:border-transparent"
              required
            />
          </div>

          {/* Status - apenas para edição */}
          {pedido && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5B25] focus:border-transparent"
              >
                <option value="Pendente">Pendente</option>
                <option value="Enviado">Enviado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          )}

          {/* Itens do Pedido */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-gray-700">Itens do Pedido</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-[#EF5B25] hover:text-orange-700 font-medium"
              >
                <Plus size={16} /> Adicionar Item
              </button>
            </div>

            <div className="space-y-3">
              {itens.map((item, index) => {
                const produto = produtos.find(p => p.Id === item.produtoId)
                const temVariacoes = produto?.Variacoes && produto.Variacoes.length > 0
                return (
                <div key={index} className="flex gap-2 items-end p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Produto</label>
                    <select
                      value={item.produtoId}
                      onChange={(e) => handleProdutoChange(index, Number(e.target.value))}
                      className="w-full p-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-2 focus:ring-[#EF5B25]"
                      required
                    >
                      <option value={0}>Selecione...</option>
                      {produtos.map((p) => (
                        <option key={p.Id} value={p.Id}>
                          {p.Nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {temVariacoes && (
                    <div className="w-32">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Tamanho</label>
                      <select
                        value={item.tamanhoId || 0}
                        onChange={(e) => handleTamanhoChange(index, Number(e.target.value))}
                        className="w-full p-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-2 focus:ring-[#EF5B25]"
                        required
                      >
                        <option value={0}>Selecione...</option>
                        {produto?.Variacoes?.map((v) => (
                          <option key={v.Id} value={v.Id}>
                            {v.Tamanho} - R$ {Number(v.ValorVenda || 0).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="w-24">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Qtd</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => handleQuantidadeChange(index, parseInt(e.target.value) || 1)}
                      className="w-full p-2 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-[#EF5B25]"
                      required
                    />
                  </div>

                  <div className="w-28">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Unitário</label>
                    <input
                      type="text"
                      value={Number(item.valorUnitario || 0) > 0 ? `R$ ${Number(item.valorUnitario).toFixed(2)}` : '-'}
                      readOnly
                      className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 text-sm text-center"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-1"
                    disabled={itens.length === 1}
                    title="Remover item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )})}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-700">Total do Pedido</span>
              <span className="font-black text-[#EF5B25]">R$ {Number(calcularTotal() || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#EF5B25] text-white rounded-xl font-bold hover:bg-[#d44d1d] shadow-lg shadow-orange-200 transition-all"
            >
              Finalizar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
