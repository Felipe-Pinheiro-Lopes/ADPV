import { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'

export function ChartCard({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <MoreHorizontal className="text-slate-400 cursor-pointer" size={20} />
      </div>
      <div className="flex-1 min-h-[300px]">
        {children}
      </div>
    </div>
  )
}