'use client'
import { AlertCircle, Package, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'

// Importando nossos componentes modulares
import { SummaryCard } from '@/src/components/SummaryCard'
import { ChartCard } from '@/src/components/ChartCard'
import { StockMovementChart } from '@/src/components/charts/StockMovementChart'
import { CategoryDistributionChart } from '@/src/components/charts/CategoryDistributionChart'
import { RecentActivitiesTable } from '@/src/components/RecentActivitiesTable'

// Definindo o que vem do Backend C#
interface DashboardData {
  totalProdutos: number;
  estoqueBaixo: number;
  pedidosPendentes: number;
  movimentacoes: Array<{ name: string; entradas: number; saidas: number }>;
  categorias: Array<{ name: string; value: number }>;
  atividadesRecentes: Array<{ id: number; item: string; type: string; qty: number; status: string; date: string }>;
}

interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

interface Activity {
  id: number;
  item: string;
  type: string;
  qty: number;
  status: string;
  date: string;
}

export default function DashboardPage() {
  // Criamos o "estado" para guardar os dados e o estado de carregamento
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosDoDashboard() {
      try {
        // Altere para a porta que sua API C# está usando (ex: 5145 ou 7145)
        const response = await fetch('http://localhost:5145/api/Dashboard/resumo');
        
        if (response.ok) {
          const resultado = await response.json();
          setDados(resultado); // Coloca os dados da API na nossa "gaveta"
        }
      } catch (erro) {
        console.error("Erro ao conectar com a API C#:", erro);
      } finally {
        setLoading(false); // Finaliza o carregamento, independente de erro ou sucesso
      }
    }

    carregarDadosDoDashboard();
  }, []); // [] significa que isso só roda UMA VEZ ao abrir a página

  // Se ainda estiver buscando na API, mostramos um aviso simples
  if (loading) return <div className="p-8 text-slate-400 font-bold">Conectando ao servidor C#...</div>;
  return (
    <div className="p-8 bg-[#FFF9F9] min-h-screen space-y-8">
      <h1 className="text-2xl font-black text-slate-800">Inventory Analytics</h1>

      {/* Cards agora usando dados reais do C# */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          label="Total Items" 
          value={dados?.totalProdutos || 0} 
          icon={<Package size={20}/>} 
        />
        <SummaryCard 
          label="Low Stock" 
          value={dados?.estoqueBaixo || 0} 
          variant="danger" 
          icon={<AlertCircle size={20}/>} 
        />
        <SummaryCard 
          label="Pending Orders" 
          value={dados?.pedidosPendentes || 0} 
          icon={<ShoppingBag size={20}/>} 
        />
      </div>

      {/* Gráficos e Tabela: Passamos a lista de dados como "props" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Stock Movement Trends">
            {/* Passamos a lista de movimentações que veio da nossa API C# */}
            <StockMovementChart data={dados?.movimentacoes} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Category Split">
            <CategoryDistributionChart data={dados?.categorias} />
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Recent Inventory Activities">
        <RecentActivitiesTable data={dados?.atividadesRecentes} />
      </ChartCard>
    </div>
  );
}