import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '@/lib/design-tokens';

interface LineChartProps {
  data: Array<Record<string, string | number> & { [key: string]: string | number }>;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  xAxisKey: string;
}

/**
 * Line chart component using Recharts
 * Configured to match design system specifications
 */
export function LineChart({ data, lines, xAxisKey }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.border} opacity={0.5} />
        <XAxis
          dataKey={xAxisKey}
          stroke={colors.text.secondary}
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <YAxis
          stroke={colors.text.secondary}
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.neutral.white,
            border: `1px solid ${colors.neutral.border}`,
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
          iconType="line"
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

