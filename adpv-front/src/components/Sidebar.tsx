'use client'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useRouter, usePathname } from 'next/navigation'


export default function Sidebar() {
  const [userRole, setUserRole] = useState('')
  const router = useRouter()
  const pathname = usePathname() // Para saber em qual página estamos e destacar o botão

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role)
      } catch (e) { console.error("Erro no token") }
    }
  }, [])

  // Estilo para o item ativo (laranja) e inativo (cinza)
  const itemAtivo = "bg-[#EF5B25] text-white p-3 rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-all"
  const itemInativo = "text-gray-500 p-3 flex items-center gap-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#EF5B25] rounded-lg"></div>
          <span className="font-bold text-xl text-gray-800">ADPV</span>
        </div>
        
        <nav className="space-y-4">
          <div 
            onClick={() => router.push('/dashboard')}
            className={pathname === '/dashboard' ? itemAtivo : itemInativo}
          >
            Dashboard
          </div>

          {/* Só renderiza se for Admin */}
          {userRole === 'Admin' && (
            <div 
              onClick={() => router.push('/usuarios')}
              className={pathname === '/usuarios' ? itemAtivo : itemInativo}
            >
              Usuários
            </div>
          )}

          <div className={itemInativo}>Estoque</div>
        </nav>
      </div>
    </aside>
  )
}