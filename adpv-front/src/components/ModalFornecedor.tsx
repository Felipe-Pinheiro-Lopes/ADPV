'use client'
import { useState, useEffect } from 'react'
import { X, Phone, Mail, MapPin } from 'lucide-react'

interface Fornecedor {
  Id: number
  Nome: string
  Cnpj: string
  Contato: string
  Telefone: string
  Email: string
  Endereco: string
}

interface ModalFornecedorProps {
  isOpen: boolean
  onClose: () => void
  onSucesso: () => void
  fornecedor?: Fornecedor | null
}

export default function ModalFornecedor({ isOpen, onClose, onSucesso, fornecedor }: ModalFornecedorProps) {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contato, setContato] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNome('')
      setCnpj('')
      setContato('')
      setTelefone('')
      setEmail('')
      setEndereco('')
    } else if (fornecedor) {
      // Populate form when editing
      setNome(fornecedor.Nome)
      setCnpj(fornecedor.Cnpj)
      setContato(fornecedor.Contato)
      setTelefone(fornecedor.Telefone)
      setEmail(fornecedor.Email)
      setEndereco(fornecedor.Endereco)
    }
  }, [isOpen, fornecedor])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token não encontrado. Faça login novamente.')
      return
    }

    const fornecedorData = {
      Id: fornecedor?.Id || 0,
      Nome: nome,
      Cnpj: cnpj,
      Contato: contato,
      Telefone: telefone,
      Email: email,
      Endereco: endereco
    }

    try {
      const url = fornecedor
        ? `http://localhost:5145/api/Fornecedor/${fornecedor.Id}`
        : 'http://localhost:5145/api/Fornecedor'
      const method = fornecedor ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fornecedorData)
      })

      const data = await res.json()
      if (res.ok) {
        alert(fornecedor ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor cadastrado com sucesso!')
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
            {fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Nome da Empresa */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa / Fornecedor</label>
            <div className="relative">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Logística Brasil S.A."
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CNPJ */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ / CPF</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                required
              />
            </div>
            {/* Contato Principal */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contato Principal</label>
              <input
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="Nome do responsável"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telefone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Phone size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full p-3 bg-transparent outline-none text-black"
                  required
                />
              </div>
            </div>
            {/* E-mail */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className="w-full p-3 bg-transparent outline-none text-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
            <div className="flex items-start bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <MapPin size={18} className="text-gray-400 mt-1" />
              <textarea
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
                rows={3}
                className="w-full p-2 bg-transparent outline-none text-black resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-3 bg-[#EF5B25] text-white font-bold rounded-xl hover:bg-[#d44d1d] transition-all shadow-lg shadow-orange-100">
              {fornecedor ? 'Atualizar' : 'Salvar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
