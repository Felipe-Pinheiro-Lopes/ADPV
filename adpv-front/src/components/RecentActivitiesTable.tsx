'use client'
import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react'

interface Activity {
  id: number;
  item: string;
  type: string;
  qty: number;
  status: string;
  date: string;
}

interface RecentActivitiesTableProps {
  data?: Activity[];
}

// Componente interno para as etiquetas de status
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    'Concluído': 'bg-emerald-50 text-emerald-600',
    'Pendente': 'bg-amber-50 text-amber-600',
    'Erro': 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}

export function RecentActivitiesTable({ data }: RecentActivitiesTableProps) {
  // Se não houver dados, mostramos uma linha amigável informando o usuário
  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-slate-400 font-medium italic">
        Nenhuma atividade recente registrada.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="pb-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Item</th>
            <th className="pb-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Tipo</th>
            <th className="pb-4 text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Qtd</th>
            <th className="pb-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((act) => (
            <tr key={act.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-4">
                <p className="text-sm font-bold text-slate-800">{act.item}</p>
                <p className="text-[10px] text-slate-400 font-medium">{act.date}</p>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {/* Ícones dinâmicos baseados no tipo que vem do C# */}
                  {act.type === 'Entrada' && <ArrowDownLeft size={14} className="text-emerald-500" />}
                  {act.type === 'Saída' && <ArrowUpRight size={14} className="text-rose-500" />}
                  {act.type === 'Ajuste' && <RefreshCcw size={14} className="text-amber-500" />}
                  <span className="text-xs font-semibold text-slate-600">{act.type}</span>
                </div>
              </td>
              <td className="py-4 text-center font-mono text-sm font-bold text-slate-700">
                {act.qty > 0 ? `+${act.qty}` : act.qty}
              </td>
              <td className="py-4">
                <StatusBadge status={act.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}