import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { LineChart } from '@/components/charts/LineChart';
import { formatDate } from '@/lib/utils';
import { getAllMonthNames } from '@/lib/utils';
import { mockAIMessages } from '@/lib/mockData';
import { AI_MESSAGE_STATUS, AI_MESSAGE_STATUS_LABELS } from '@/lib/constants';
import { colors } from '@/lib/design-tokens';

/**
 * Analytics tab component for AI Automation
 * Shows KPIs, sending activity graph, and recent messages table
 */
export function AnalyticsTab() {
  // Generate sending activity data for 12 months
  const sendingActivityData = getAllMonthNames().map((month, index) => {
    // Mock data matching the photo
    const blueLineData = [14, 16, 13, 10, 7, 15, 22, 16, 7, 28, 22, 19];
    const greenLineData = [10, 12, 9, 7, 4, 13, 15, 16, 7, 20, 22, 19];
    
    return {
      month,
      siustu: blueLineData[index],
      atidaryta: greenLineData[index],
    };
  });

  const chartLines = [
    {
      dataKey: 'siustu',
      name: 'Išsiųsta',
      color: colors.primary.default,
    },
    {
      dataKey: 'atidaryta',
      name: 'Atidaryta',
      color: colors.chart.green,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analitika</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">87%</p>
              <p className="text-sm text-gray-600">Atidarytų žinučių</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">64%</p>
              <p className="text-sm text-gray-600">Paspaudimų rodiklis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">29%</p>
              <p className="text-sm text-gray-600">Konversijos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sending Activity Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Siuntimo aktyvumas (statinis grafikas)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={sendingActivityData}
            lines={chartLines}
            xAxisKey="month"
          />
        </CardContent>
      </Card>

      {/* Recent AI Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Paskutinės 10 AI žinučių</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Žingsnis</TableHead>
                <TableHead>Klientas</TableHead>
                <TableHead>Statusas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAIMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{formatDate(message.date)}</TableCell>
                  <TableCell>{message.step}</TableCell>
                  <TableCell>{message.client}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      message.status === AI_MESSAGE_STATUS.SENT ? 'bg-blue-100 text-blue-700' :
                      message.status === AI_MESSAGE_STATUS.OPENED ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {AI_MESSAGE_STATUS_LABELS[message.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

