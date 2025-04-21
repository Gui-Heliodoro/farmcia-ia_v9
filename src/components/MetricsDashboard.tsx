import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, BarChart3, Clock, UserCheck, MessageSquare } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MetricData, ChartData } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MetricsDashboard = () => {
  // Mock metrics data - would come from API in real application
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: 'Taxa de Resolução IA',
      value: 78,
      change: 5,
      trend: 'up',
      unit: '%',
    },
    {
      title: 'Tempo Médio de Resposta',
      value: '2.5',
      change: -10,
      trend: 'down',
      unit: 'min',
    },
    {
      title: 'Conversas Atendidas',
      value: 245,
      change: 12,
      trend: 'up',
    },
    {
      title: 'Vendas por Conversa',
      value: '89.50',
      change: 0,
      trend: 'neutral',
      unit: 'R$',
    },
  ]);

  // Mock chart data
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Conversas',
        data: [65, 59, 80, 81, 56, 40, 30],
        borderColor: '#0F52BA',
        backgroundColor: 'rgba(15, 82, 186, 0.1)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Resoluções por IA',
        data: [45, 42, 60, 59, 38, 29, 20],
        borderColor: '#2E8B57',
        backgroundColor: 'rgba(46, 139, 87, 0.1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-card p-4 transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
            <MetricIcon metric={metric} />
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {typeof metric.value === 'number' && metric.unit === '%' 
                ? `${metric.value}${metric.unit}` 
                : typeof metric.value === 'string' && metric.unit === 'R$'
                ? `${metric.unit} ${metric.value}`
                : `${metric.value}${metric.unit ? ` ${metric.unit}` : ''}`}
            </p>
            {metric.change !== undefined && (
              <span
                className={`ml-2 text-sm font-medium ${
                  metric.trend === 'up'
                    ? 'text-green-600'
                    : metric.trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-500'
                } flex items-center`}
              >
                {metric.trend === 'up' ? (
                  <>
                    <ArrowUpRight size={14} className="mr-1" />
                    {`+${metric.change}%`}
                  </>
                ) : metric.trend === 'down' ? (
                  <>
                    <ArrowDownRight size={14} className="mr-1" />
                    {`${metric.change}%`}
                  </>
                ) : (
                  <>
                    <Minus size={14} className="mr-1" />
                    {`${metric.change}%`}
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Chart */}
      <div className="lg:col-span-4 bg-white rounded-lg shadow-card p-4">
        <h3 className="text-md font-medium text-gray-700 mb-4">Atividade Semanal</h3>
        <div className="h-80">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  );
};

// Helper component for metric icons
const MetricIcon = ({ metric }: { metric: MetricData }) => {
  const icons = {
    'Taxa de Resolução IA': (
      <div className="p-2 bg-green-50 text-green-600 rounded-full">
        <UserCheck size={18} />
      </div>
    ),
    'Tempo Médio de Resposta': (
      <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
        <Clock size={18} />
      </div>
    ),
    'Conversas Atendidas': (
      <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
        <MessageSquare size={18} />
      </div>
    ),
    'Vendas por Conversa': (
      <div className="p-2 bg-accent-50 text-accent-600 rounded-full">
        <BarChart3 size={18} />
      </div>
    ),
  };

  return icons[metric.title as keyof typeof icons] || null;
};

export default MetricsDashboard;