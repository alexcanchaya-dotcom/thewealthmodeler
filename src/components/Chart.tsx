'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface ChartProps {
  labels: string[];
  totalValue: number[];
  contributions: number[];
}

export default function Chart({ labels, totalValue, contributions }: ChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Value',
        data: totalValue,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Total Contributions',
        data: contributions,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.raw?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${Number(value).toLocaleString()}`,
        },
      },
    },
  } as const;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <Line data={data} options={options} />
    </div>
  );
}
