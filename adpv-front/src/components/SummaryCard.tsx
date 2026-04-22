import { ReactNode } from 'react'

interface SummaryCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  variant?: 'danger' | 'success' | 'normal';
}

export function SummaryCard({ label, value, subValue, icon, variant = 'normal' }: SummaryCardProps) {
  // Cores dinâmicas baseadas na variante (Ex: estoque crítico vs total)
  const styles = {
    danger: "text-red-600 bg-red-50",
    success: "text-emerald-600 bg-emerald-50",
    normal: "text-indigo-600 bg-indigo-50"
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</span>
        {icon && <div className={`p-2.5 rounded-xl ${styles[variant]}`}>{icon}</div>}
      </div>
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
        {subValue && (
          <p className={`text-[10px] font-bold mt-2 px-2 py-1 rounded-full inline-block ${styles[variant]}`}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}