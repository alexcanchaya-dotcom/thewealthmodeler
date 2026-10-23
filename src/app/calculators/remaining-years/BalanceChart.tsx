'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  ages: number[];
  balances: number[];
  planToAge: number;
}

const fmt = (v: number) => Math.round(v).toLocaleString('en-IE');

export default function BalanceChart({ ages, balances, planToAge }: Props) {
  // Draws a dashed vertical line at the plan-to age.
  const planLine: Plugin<'line'> = {
    id: 'planToLine',
    afterDatasetsDraw(chart) {
      const idx = ages.indexOf(planToAge);
      if (idx < 0) return;
      const x = chart.scales.x.getPixelForValue(idx);
      const { top, bottom } = chart.chartArea;
      const ctx = chart.ctx;
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Plan to ${planToAge}`, x + 4, top + 12);
      ctx.restore();
    },
  };

  const data = {
    labels: ages.map(String),
    datasets: [
      {
        label: 'Balance',
        data: balances,
        borderColor: '#5e8bfd',
        backgroundColor: 'rgba(94, 139, 253, 0.18)',
        tension: 0.25,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { title: (items: { label: string }[]) => `Age ${items[0]?.label}`, label: (c: { raw: unknown }) => fmt(Number(c.raw)) } },
    },
    scales: {
      x: { title: { display: true, text: 'Age', color: '#aeb6dd' }, ticks: { color: '#aeb6dd' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { beginAtZero: true, ticks: { color: '#aeb6dd', callback: (v: string | number) => fmt(Number(v)) }, grid: { color: 'rgba(255,255,255,0.12)' } },
    },
  };

  return (
    <div className="rounded-xl border border-glass-line bg-glass-subtle p-4" role="img" aria-label={`Balance by age, with a line at age ${planToAge}`}>
      <Line data={data} options={options} plugins={[planLine]} />
    </div>
  );
}
