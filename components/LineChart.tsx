'use client';

import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  className?: string;
}

export function LineChart({ data, options, className }: LineChartProps) {
  return <Line data={data} options={options} className={className} />;
}
