'use client' // Importante: Componentes que usam formulários precisam ser Client Components

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Aqui é onde faremos a conexão com o seu C#
    console.log("Tentando logar com:", { email, senha })
    
    // Exemplo de como será a chamada (vamos ajustar a URL se necessário)
    try {
      const response = await fetch('http://localhost:5145/api/User/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Token recebido:", data.token)
        alert("Login realizado com sucesso!")
        // Aqui guardaremos o token no futuro
      } else {
        alert("E-mail ou senha incorretos")
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-10 border rounded-xl shadow-lg bg-white w-96">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">Acesso ao Sistema</h1>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">E-mail</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Senha</label>
          <input 
            type="password" 
            placeholder="********" 
            className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">
          Entrar
        </button>
      </form>
    </div>
  )
}