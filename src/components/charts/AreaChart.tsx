import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '@/lib/design-tokens';

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  areas: Array<{
    dataKey: string;
    name: string;
    strokeColor: string;
    fillColor: string;
    fillGradientId: string;
  }>;
  xAxisKey: string;
  height?: number;
}

/**
 * Area chart component using Recharts
 * Configured to match design system specifications with filled areas
 */
export function AreaChart({ data, areas, xAxisKey, height = 400 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.fillGradientId} id={area.fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.fillColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.fillColor} stopOpacity={0.2} />
            </linearGradient>
          ))}
        </defs>
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
          iconType="circle"
        />
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.strokeColor}
            fill={`url(#${area.fillGradientId})`}
            fillOpacity={1}
            strokeWidth={2}
            dot={{ r: 4, fill: area.strokeColor, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

