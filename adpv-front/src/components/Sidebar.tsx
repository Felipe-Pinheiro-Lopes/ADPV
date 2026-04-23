'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Package, Truck, ClipboardList, BarChart3, Users, Settings, LogOut, TrendingUp } from 'lucide-react'

function getRoleFromToken(): 'Admin' | 'User' {
  try {
    const token = localStorage.getItem('token')
    if (!token) return 'User'
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'Admin' ? 'Admin' : 'User'
  } catch {
    return 'User'
  }
}

export default function Sidebar() {
  const pathname = usePathname()
  const [userName, setUserName] = useState('Usuário')
  const [role, setRole] = useState<'Admin' | 'User'>('User')

  useEffect(() => {
    const stored = localStorage.getItem('userName')
    if (stored) {
      setUserName(stored.split(' ')[0])
    }

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role === 'Admin') {
          setRole('Admin')
        }
      } catch (err) {
        console.error('Erro ao decodificar token:', err)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax'
    window.location.href = '/login'
  }

   const menuItems = [
     { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
     { name: 'Estoque', path: '/estoque', icon: <Package size={20} /> },
     { name: 'Categorias', path: '/categorias', icon: <Settings size={20} /> },
     { name: 'Fornecedores', path: '/fornecedores', icon: <Truck size={20} /> },
     { name: 'Pedidos', path: '/pedidos', icon: <ClipboardList size={20} /> },
     ...(role === 'Admin' ? [
        { name: 'Usuários', path: '/usuarios', icon: <Users size={20} /> },
        { name: 'Relatórios', path: '/relatorios', icon: <BarChart3 size={20} /> },
        { name: 'Prod. Mais Vendidos', path: '/produtos-mais-vendidos', icon: <TrendingUp size={20} /> }
      ] : []),
   ]

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-4 mb-8">
        <div className="w-8 h-8 bg-[#EF5B25] rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-xl font-bold text-gray-800">ADPV</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-orange-50 text-[#EF5B25]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Perfil do Usuário */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EF5B25] font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-400">Perfil</p>
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-all"
        >
          <LogOut size={20} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  )
}