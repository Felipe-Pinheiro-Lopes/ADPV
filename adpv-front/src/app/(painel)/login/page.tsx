'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5145/api/User/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        // Salva no cookie para o middleware
        document.cookie = `token=${data.token}; path=/; max-age=7200; SameSite=Lax`
        router.push('/dashboard')
      } else {
        alert("Credenciais inválidas")
      }
    } catch (error) {
      console.error("Erro ao conectar:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* LADO ESQUERDO: Imagem e Texto (Inspirado na sua foto) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Camada de imagem de fundo */}
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
          alt="Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EF5B25] rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-white font-bold text-xl uppercase tracking-widest">A.P.D.V.</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Otimize suas operações de <br />
              <span className="text-[#EF5B25]">Estoque</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md">
              Consulta em tempo real e previsão inteligente em um único dashboard profissional.
            </p>
          </div>

          <div className="flex gap-8 text-white">
            <div><p className="font-bold text-2xl">99.9%</p><p className="text-xs text-gray-400">Uptime</p></div>
            <div><p className="font-bold text-2xl">24/7</p><p className="text-xs text-gray-400">Suporte</p></div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
          <p className="text-gray-500 mb-8">Por favor, insira seus detalhes para acessar o painel.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço de E-mail</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF5B25] focus:border-transparent outline-none transition-all text-black"
                placeholder="ex: admin@logitrack.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sua Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF5B25] focus:border-transparent outline-none transition-all text-black"
                placeholder="••••••••"
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#EF5B25]" />
                Lembrar por 30 dias
              </label>
              <a href="#" className="text-[#EF5B25] font-semibold">Esqueceu a senha?</a>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#EF5B25] text-white font-bold py-3 rounded-lg hover:bg-[#d44d1d] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
            >
              Entrar no Dashboard
              <span>→</span>
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            Não tem uma conta? <a href="#" className="text-[#EF5B25] font-bold">Contate o suporte</a>
          </p>
        </div>
      </div>
    </div>
  )
}