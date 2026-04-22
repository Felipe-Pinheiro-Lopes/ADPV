'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function FornecedoresPage() {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [contato, setContato] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const novoFornecedor = { 
        Nome: nome, 
        Cnpj: cnpj, 
        Contato: contato, 
        Telefone: telefone, 
        Email: email, 
        Endereco: endereco 
    };

    try {
        const res = await fetch('http://localhost:5145/api/Fornecedor', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(novoFornecedor)
        });

        if (res.ok) {
        alert("Fornecedor cadastrado com sucesso!");
        // Limpar campos após o sucesso
        setNome(''); setCnpj(''); setContato('');
        setTelefone(''); setEmail(''); setEndereco('');
        } else {
        const erro = await res.json();
        alert("Erro: " + (erro.message || "Falha ao cadastrar"));
        }
    } catch (error) {
        console.error("Erro na conexão com a API", error);
        alert("Erro de conexão com o servidor.");
    }
    };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e1b4b]">Cadastro de Fornecedor</h1>
        <p className="text-gray-500">Preencha as informações detalhadas para registrar um novo parceiro comercial no sistema.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSalvar} className="space-y-6">
          
          {/* Nome da Empresa */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa / Fornecedor</label>
            <div className="relative">
              <input 
                type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Logística Brasil S.A."
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF5B25] outline-none text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CNPJ */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ / CPF</label>
              <input 
                type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
              />
            </div>
            {/* Contato Principal */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contato Principal</label>
              <input 
                type="text" value={contato} onChange={(e) => setContato(e.target.value)}
                placeholder="Nome do responsável"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-black"
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
                  type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full p-3 bg-transparent outline-none text-black"
                />
              </div>
            </div>
            {/* E-mail */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                <Mail size={18} className="text-gray-400" />
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className="w-full p-3 bg-transparent outline-none text-black"
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
                value={endereco} onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
                rows={3}
                className="w-full p-2 bg-transparent outline-none text-black resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-3 bg-[#EF5B25] text-white font-bold rounded-xl hover:bg-[#d44d1d] transition-all shadow-lg shadow-orange-100">
              Salvar Fornecedor
            </button>
          </div>
        </form>
      </div>

      {/* Dica de Preenchimento */}
      <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-4">
        <div className="w-6 h-6 bg-[#EF5B25] rounded-full flex items-center justify-center text-white text-xs font-bold">i</div>
        <div>
          <h4 className="text-sm font-bold text-[#EF5B25] uppercase tracking-wider">Dica de preenchimento</h4>
          <p className="text-sm text-orange-800">Certifique-se de que o CNPJ é válido para evitar problemas na emissão de notas fiscais futuras.</p>
        </div>
      </div>
    </div>
  )
}