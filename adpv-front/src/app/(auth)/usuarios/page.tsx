'use client'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

interface Usuario {
  Id: number;
  Nome: string;
  Email: string;
  Role: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)

  const [isModalAberto, setIsModalAberto] = useState(false)
  const [isEditando, setIsEditando] = useState(false)
  const [idParaEditar, setIdParaEditar] = useState<number | null>(null)

  const [novoNome, setNovoNome] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [novaRole, setNovaRole] = useState('User')

  const carregarUsuarios = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5145/api/User/listar', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUsuarios(data)
      }
    } catch (err) {
      console.error("Erro ao carregar usuários", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<{exp: number; role?: string; "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string}>(token)
      
      const agora = Date.now() / 1000;
      if (decoded.exp < agora) {
        localStorage.removeItem('token');
        router.push('/login');
        return
      }

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role
      
      if (role !== 'Admin') {
        router.push('/dashboard')
        return
      }

      setAutorizado(true)
      setCarregando(false)
      carregarUsuarios()
    } catch {
      localStorage.removeItem('token');
      router.push('/login')
    }
  }, [router])

  const abrirEdicao = (user: Usuario) => {
    setIsEditando(true);
    setIdParaEditar(user.Id);
    setNovoNome(user.Nome);
    setNovoEmail(user.Email);
    setNovaRole(user.Role || 'User');
    setNovaSenha('');
    setIsModalAberto(true);
  };

  const fecharModal = () => {
    setIsModalAberto(false)
    setIsEditando(false)
    setIdParaEditar(null)
    setNovoNome('')
    setNovoEmail('')
    setNovaSenha('')
    setNovaRole('User')
  }

  const salvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    const url = isEditando 
      ? `http://localhost:5145/api/User/${idParaEditar}` 
      : 'http://localhost:5145/api/User/register'
    
    const metodo = isEditando ? 'PUT' : 'POST'

    const dadosParaEnviar: { Nome: string; Email: string; Role: string; Senha?: string } = {
      Nome: novoNome,
      Email: novoEmail,
      Role: novaRole
    }

    if (novaSenha.trim() !== "") {
      dadosParaEnviar.Senha = novaSenha
    } else if (!isEditando) {
      alert("A senha é obrigatória para novos usuários.")
      return
    }

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dadosParaEnviar)
      })

      if (response.ok) {
        alert(isEditando ? "Usuário atualizado!" : "Usuário cadastrado!")
        fecharModal()
        carregarUsuarios()
      } else {
        const erroTexto = await response.text()
        alert(`Erro ao salvar: ${erroTexto || "Verifique os dados."}`)
      }
    } catch {
      alert("Erro de conexão com o servidor.")
    }
  }

  const excluirUsuario = async (id: number) => {
    if (!confirm("Remover este usuário permanentemente?")) return
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:5145/api/User/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.ok) {
      setUsuarios(usuarios.filter((u) => u.Id !== id))
    }
  }

  if (carregando || !autorizado) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF5B25] mx-auto mb-4"></div>
          <p className="font-bold text-gray-600">Validando permissões de acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Lista de Acessos</h3>
          
          <button 
            onClick={() => { setIsEditando(false); setIsModalAberto(true); }}
            className="bg-orange-50 text-[#EF5B25] px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-100 transition-colors"
          >
            + Novo Usuário
          </button>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-[#FCFDFF]">
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">E-mail</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.map((user) => (
              <tr key={user.Id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{user.Nome}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.Email}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => abrirEdicao(user)} 
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => excluirUsuario(user.Id)} 
                    className="text-red-400 hover:text-red-600 font-medium"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditando ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            
            <form onSubmit={salvarUsuario} className="space-y-4">
              <input 
                type="text" placeholder="Nome Completo" required
                value={novoNome}
                className="w-full p-3 border rounded-lg text-black outline-[#EF5B25]"
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <input 
                type="email" placeholder="E-mail" required
                value={novoEmail}
                className="w-full p-3 border rounded-lg text-black outline-[#EF5B25]"
                onChange={(e) => setNovoEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder={isEditando ? "Nova senha (deixe vazio para manter)" : "Senha"} 
                required={!isEditando}
                value={novaSenha}
                className="w-full p-3 border rounded-lg text-black outline-[#EF5B25]"
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuário</label>
              <select 
                value={novaRole}
                className="w-full p-3 border rounded-lg text-black outline-[#EF5B25] bg-white"
                onChange={(e) => setNovaRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={fecharModal} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#EF5B25] text-white rounded-lg font-bold hover:bg-[#d44d1d]">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}