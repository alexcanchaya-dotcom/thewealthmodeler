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
        borderColor: '#5e8bfd',
        backgroundColor: 'rgba(94, 139, 253, 0.18)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Total Contributions',
        data: contributions,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.15)',
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
        labels: {
          color: '#d6dbf5',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(21, 13, 49, 0.95)',
        titleColor: '#f5f7ff',
        bodyColor: '#d6dbf5',
        borderColor: 'rgba(255, 255, 255, 0.22)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `$${context.raw?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#aeb6dd' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#aeb6dd',
          callback: (value: any) => `$${Number(value).toLocaleString()}`,
        },
        grid: { color: 'rgba(255, 255, 255, 0.12)' },
      },
    },
  } as const;

  return (
    <div className="rounded-xl border border-glass-line bg-glass-subtle p-4 shadow-card backdrop-blur-sm">
      <Line data={data} options={options} />
    </div>
  );
}
