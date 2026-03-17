'use client'
import { useEffect, useState } from 'react'
import LogoutButton from '@/src/components/LogoutButton'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [userRole, setUserRole] = useState('')
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)

  // Estados do Modal e Controle de Edição
  const [isModalAberto, setIsModalAberto] = useState(false)
  const [isEditando, setIsEditando] = useState(false)
  const [idParaEditar, setIdParaEditar] = useState<number | null>(null)

  // Estados dos Campos do Formulário
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
    } catch (error) {
      console.error("Erro ao carregar usuários", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded: any = jwtDecode(token)
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role
      if (role !== 'Admin') {
        router.push('/dashboard')
        return
      }
      setUserRole(role)
      setCarregando(false) 
      carregarUsuarios()
    } catch (error) {
      router.push('/login')
    }
  }, [router])

      // --- FUNÇÕES DE AÇÃO ---

  const abrirEdicao = (user: any) => {
    setIsEditando(true);
    setIdParaEditar(user.id);
    setNovoNome(user.nome);
    setNovoEmail(user.email);
    
    // Verifica se veio 'role' ou 'Role' do JSON da API
    const cargoAtual = user.role || user.Role || 'User';
    setNovaRole(cargoAtual);
    
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

    // Criamos o objeto de dados. 
    // Dica: Se na edição a senha estiver vazia, podemos optar por nem enviar o campo
    // para evitar que o C# tente validar uma string vazia como senha.
    const dadosParaEnviar: any = {
      nome: novoNome,
      email: novoEmail,
      role: novaRole
    }

    if (novaSenha.trim() !== "") {
      dadosParaEnviar.senha = novaSenha
    } else if (!isEditando) {
      // Se não for edição, a senha é obrigatória
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
    } catch (err) {
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
      setUsuarios(usuarios.filter((u: any) => u.id !== id))
    }
  }

  if (carregando) return <div className="p-8 text-center font-bold">Validando acesso...</div>

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
        <LogoutButton />
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Lista de Acessos</h3>
          
          {userRole === 'Admin' && (
            <button 
              onClick={() => { setIsEditando(false); setIsModalAberto(true); }}
              className="bg-orange-50 text-[#EF5B25] px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-100 transition-colors"
            >
              + Novo Usuário
            </button>
          )}
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
            {usuarios.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{user.nome}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => abrirEdicao(user)} 
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => excluirUsuario(user.id)} 
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