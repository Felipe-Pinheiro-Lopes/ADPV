'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Importe ícones se estiver usando lucide-react ou react-icons
import { LayoutDashboard, Package, Truck, ClipboardList, BarChart3, Users, Settings } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Estoque', path: '/estoque', icon: <Package size={20} /> },
    { name: 'Categorias', path: '/categorias', icon: <Settings size={20} /> }, // Nova rota
    { name: 'Fornecedores', path: '/fornecedores', icon: <Truck size={20} /> }, // Nova rota
    { name: 'Usuários', path: '/usuarios', icon: <Users size={20} /> },
    { name: 'Pedidos', path: '/pedidos', icon: <ClipboardList size={20} /> }, // Futuro
    { name: 'Relatórios', path: '/relatorios', icon: <BarChart3 size={20} /> }, // Futuro
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-4 mb-10">
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

      {/* Perfil do Usuário no rodapé do menu */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#EF5B25] font-bold">
            AU
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Admin Usuário</p>
            <p className="text-xs text-gray-400">Configurações</p>
          </div>
        </div>
      </div>
    </aside>
  )
}