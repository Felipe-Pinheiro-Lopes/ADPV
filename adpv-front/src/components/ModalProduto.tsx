'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Save, Package, Info, Tag, Users } from 'lucide-react'

interface ModalProps {
  onClose: () => void;
  onSucesso: () => void;
  dadosEdicao?: any; 
}

export default function ModalProduto({ onClose, onSucesso, dadosEdicao }: ModalProps) {
  const [nome, setNome] = useState('')
  const [tipoId, setTipoId] = useState('')
  const [fornecedorId, setFornecedorId] = useState('')
  const [variacoes, setVariacoes] = useState([{ tamanho: '', valorCompra: 0, valorVenda: 0, quantidade: 0 }])
  
  const [categorias, setCategorias] = useState([])
  const [fornecedores, setFornecedores] = useState([])

useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token não encontrado')
        return
      }
      const headers = { 'Authorization': `Bearer ${token}` }

      fetch('http://localhost:5145/api/Tipo', { headers })
        .then(res => {
          if (!res.ok) throw new Error(`Erro ${res.status}`)
          return res.json()
        })
        .then(data => {
          console.log('Categorias carregadas:', data)
          setCategorias(data)
        })
        .catch(err => console.error("Erro tipos:", err))

      fetch('http://localhost:5145/api/Fornecedor', { headers })
        .then(res => {
          if (!res.ok) throw new Error(`Erro ${res.status}`)
          return res.json()
        })
        .then(data => {
          console.log('Fornecedores carregados:', data)
          setFornecedores(data)
        })
        .catch(err => console.error("Erro fornecedores:", err))
    }, [])

    useEffect(() => {
      if (dadosEdicao) {
        console.log('Dados edição recebidos:', dadosEdicao)
        setNome(dadosEdicao.Nome || dadosEdicao.nome || '')
        setTipoId(dadosEdicao.TipoId?.toString() || dadosEdicao.tipoId?.toString() || '')
        setFornecedorId(dadosEdicao.FornecedorId?.toString() || dadosEdicao.fornecedorId?.toString() || '')
        const variacoesData = dadosEdicao.Variacoes || dadosEdicao.variacoes || []
        setVariacoes(variacoesData.length > 0 ? variacoesData.map((v: any) => ({
          tamanho: v.Tamanho || v.tamanho || '',
          valorCompra: v.ValorCompra || v.valorCompra || 0,
          valorVenda: v.ValorVenda || v.valorVenda || 0,
          quantidade: v.Quantidade || v.quantidade || 0
        })) : [{ tamanho: '', valorCompra: 0, valorVenda: 0, quantidade: 0 }])
      }
    }, [dadosEdicao])

   const handleSalvar = async (e: React.FormEvent) => {
     e.preventDefault();
     const token = localStorage.getItem('token');
     
     if (!token) {
       alert("Token não encontrado. Faça login novamente.");
       return;
     }
     
     if (!tipoId || !fornecedorId) {
       alert("Por favor, selecione uma categoria e um fornecedor.");
       return;
     }

const metodo = dadosEdicao ? 'PUT' : 'POST';
      const url = dadosEdicao 
          ? `http://localhost:5145/api/Produto/${dadosEdicao.Id}` 
          : 'http://localhost:5145/api/Produto/cadastrar';

     try {
       const payload = {
           Nome: nome,
           TipoId: parseInt(tipoId),
           FornecedorId: parseInt(fornecedorId),
           Variacoes: variacoes.map(v => ({
             Tamanho: v.tamanho,
             ValorCompra: v.valorCompra,
             ValorVenda: v.valorVenda,
             Quantidade: v.quantidade
           }))
         }
         
       console.log('Enviando payload:', payload)
       
       const res = await fetch(url, {
         method: metodo,
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}` 
         },
         body: JSON.stringify(payload)
       });

       const data = await res.json();
       
       if (res.ok) {
         alert(dadosEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')
         onSucesso();
         onClose();
       } else {
         alert("Erro ao salvar: " + (data.message || JSON.stringify(data)))
       }
     } catch (err: any) {
       console.error(err);
       alert("Erro na requisição: " + err.message);
     }
   };

  const addVariacao = () => {
    setVariacoes([...variacoes, { tamanho: '', valorCompra: 0, valorVenda: 0, quantidade: 0 }])
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header - Design Limpo */}
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-orange-50/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EF5B25] rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Package size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1e1b4b] tracking-tight">
                {dadosEdicao ? 'Editar Registro' : 'Novo Produto'}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Gestão de Inventário</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-2xl transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSalvar} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Seção Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                <Info size={14} /> Nome do Material
              </label>
              <input 
                placeholder="Ex: Telha Romana" 
                value={nome} 
                onChange={e => setNome(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#EF5B25] focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition-all text-slate-700 font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                <Tag size={14} /> Categoria / Tipo
              </label>
               <select 
                 value={tipoId} 
                 onChange={e => setTipoId(e.target.value)} 
                 className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#EF5B25] focus:bg-white outline-none transition-all text-slate-700 font-semibold appearance-none"
                 required
               >
                 <option value="">Selecione...</option>
                 {categorias.map((c: any) => (
                   <option key={c.Id} value={c.Id}>{c.Nome}</option>
                 ))}
               </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
              <Users size={14} /> Fornecedor Origem
            </label>
             <select 
               value={fornecedorId} 
               onChange={e => setFornecedorId(e.target.value)} 
               className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#EF5B25] focus:bg-white outline-none transition-all text-slate-700 font-semibold appearance-none"
               required
             >
               <option value="">Escolha um fornecedor cadastrado</option>
               {fornecedores.map((f: any) => (
                 <option key={f.Id} value={f.Id}>{f.Nome}</option>
               ))}
             </select>
          </div>

          {/* Área da Grade de Variações */}
          <div className="space-y-5">
            <div className="flex justify-between items-end border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-[#1e1b4b] uppercase tracking-tighter">Grade de Variações</h3>
                <p className="text-xs text-slate-400 font-medium">Defina tamanhos, custos e preços de venda</p>
              </div>
              <button 
                type="button" 
                onClick={addVariacao} 
                className="bg-orange-50 text-[#EF5B25] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#EF5B25] hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} strokeWidth={3} /> Add Tamanho
              </button>
            </div>
            
            <div className="space-y-3">
              {variacoes.map((v, i) => (
                <div key={i} className="group flex flex-wrap md:flex-nowrap gap-4 items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100 hover:border-orange-100 hover:bg-white transition-all">
                  <div className="w-20">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-1">Tam</label>
                    <input 
                      value={v.tamanho} 
                      onChange={e => {const n = [...variacoes]; n[i].tamanho = e.target.value; setVariacoes(n)}} 
                      className="w-full p-3 bg-white rounded-xl border border-slate-200 text-[#EF5B25] text-center font-black outline-none focus:border-[#EF5B25]" 
                      placeholder="M"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-1">Custo (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={v.valorCompra} 
                      onChange={e => {const n = [...variacoes]; n[i].valorCompra = parseFloat(e.target.value) || 0; setVariacoes(n)}} 
                      className="w-full p-3 bg-white rounded-xl border border-slate-200 text-slate-600 font-bold outline-none focus:border-slate-400" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-1">Venda (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={v.valorVenda} 
                      onChange={e => {const n = [...variacoes]; n[i].valorVenda = parseFloat(e.target.value) || 0; setVariacoes(n)}} 
                      className="w-full p-3 bg-white rounded-xl border border-slate-200 text-emerald-600 font-black outline-none focus:border-emerald-500" 
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-1">Estoque</label>
                    <input 
                      type="number" 
                      value={v.quantidade} 
                      onChange={e => {const n = [...variacoes]; n[i].quantidade = parseInt(e.target.value) || 0; setVariacoes(n)}} 
                      className="w-full p-3 bg-white rounded-xl border border-slate-200 text-slate-600 font-bold outline-none" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setVariacoes(variacoes.filter((_, idx) => idx !== i))} 
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mt-4"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer com Ações */}
        <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors"
          >
            Descartar
          </button>
          <button 
            onClick={handleSalvar} 
            className="flex-[2] bg-[#EF5B25] text-white py-4 rounded-[22px] font-black shadow-lg shadow-orange-100 hover:bg-[#d44d1d] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Save size={22} /> {dadosEdicao ? 'Salvar Alterações' : 'Finalizar Cadastro'}
          </button>
        </div>
      </div>
    </div>
  )
}