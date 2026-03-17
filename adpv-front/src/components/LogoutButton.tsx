'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // 1. Remove o token do LocalStorage
    localStorage.removeItem('token')

    // 2. Remove o token dos Cookies (atrasando o tempo de expiração para o passado)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

    // 3. Redireciona para o login
    router.push('/login')
  }

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Sair do Sistema
    </button>
  )
}