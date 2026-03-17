'use client'
import LogoutButton from '@/src/components/LogoutButton'

export default function DashboardPage() {
  return (
    // Removi o 'flex' do container pai para ele não brigar com o layout
    <div className="p-8 h-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao ADPV</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Esta é a sua área de visão geral. Em breve teremos gráficos e indicadores de estoque aqui!
        </p>
        <LogoutButton />
      </div>
    </div>
  )
}