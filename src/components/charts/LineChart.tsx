import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { colors } from '@/lib/design-tokens';

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  xAxisKey: string;
  height?: number;
  showLabels?: boolean;
  showLegend?: boolean;
}

/**
 * Custom label component to show numbers on data points
 */
const CustomLabel = ({ x, y, value }: { x?: number; y?: number; value?: number }) => {
  if (x === undefined || y === undefined || value === undefined) return null;
  
  return (
    <text
      x={x}
      y={y - 8}
      fill="#666"
      textAnchor="middle"
      fontSize={12}
      fontWeight={500}
    >
      {value}
    </text>
  );
};

/**
 * Custom legend component that renders immediately (before chart animation)
 */
function CustomLegend({ lines }: { lines: Array<{ name: string; color: string }> }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pb-4" style={{ fontSize: '14px' }}>
      {lines.map((line) => (
        <div key={line.name} className="flex items-center gap-2">
          <span
            className="inline-block rounded-full"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: line.color,
            }}
          />
          <span style={{ color: colors.text.primary }}>{line.name}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Line chart component using Recharts
 * Configured to match design system specifications
 * Shows numbers on data points and uses blue/green colors
 * Legend appears immediately before chart animation
 */
export function LineChart({ data, lines, xAxisKey, height = 400, showLabels = true, showLegend = true }: LineChartProps) {
  return (
    <div>
      {showLegend && <CustomLegend lines={lines} />}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.border} strokeWidth={1} opacity={0.7} />
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
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 5, fill: line.color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
            >
              {showLabels && <LabelList content={<CustomLabel />} />}
            </Line>
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

