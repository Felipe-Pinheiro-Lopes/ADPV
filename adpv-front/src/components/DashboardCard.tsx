'use client'

export function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-move">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1e1b4b]">{title}</h3>
        <button className="text-slate-400 hover:text-slate-600">...</button>
      </div>
      <div className="h-[250px] w-full">
        {children}
      </div>
    </div>
  );
}