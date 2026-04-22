'use client'
import { FileText, Download, TrendingUp, Package, DollarSign } from 'lucide-react'
import { ChartCard } from '@/src/components/ChartCard'

export default function RelatoriosPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Relatórios e Performance</h1>
        <p className="text-sm text-slate-400">Analise os números do seu negócio de forma simplificada.</p>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Faturamento Mensal</p>
            <p className="text-xl font-black text-slate-800">R$ 12.450,00</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Package size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Itens Movimentados</p>
            <p className="text-xl font-black text-slate-800">842 un.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Crescimento</p>
            <p className="text-xl font-black text-slate-800">+14.2%</p>
          </div>
        </div>
      </div>

      <ChartCard title="Exportar Documentos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-[#EF5B25]/30 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-slate-400 group-hover:text-[#EF5B25]" />
              <div>
                <p className="font-bold text-slate-700">Relatório de Estoque Atual</p>
                <p className="text-xs text-slate-400">PDF • Atualizado agora</p>
              </div>
            </div>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-[#EF5B25] hover:text-white transition-all">
              <Download size={20} />
            </button>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-[#EF5B25]/30 transition-colors">
            <div className="flex items-center gap-4">
              <FileText className="text-slate-400 group-hover:text-[#EF5B25]" />
              <div>
                <p className="font-bold text-slate-700">Fechamento de Vendas (Mês)</p>
                <p className="text-xs text-slate-400">Excel • 01/04 a 30/04</p>
              </div>
            </div>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-[#EF5B25] hover:text-white transition-all">
              <Download size={20} />
            </button>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}