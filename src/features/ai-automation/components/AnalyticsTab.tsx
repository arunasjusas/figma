import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { LineChart } from '@/components/charts/LineChart';
import { formatDate } from '@/lib/utils';
import { useAIAnalyticsStore } from '@/store/aiAnalyticsStore';
import { AI_MESSAGE_STATUS, AI_MESSAGE_STATUS_LABELS } from '@/lib/constants';
import { colors } from '@/lib/design-tokens';

/**
 * Analytics tab component for AI Automation
 * Shows KPIs, sending activity graph, and recent messages table
 * Uses real data from invoice store
 */
export function AnalyticsTab() {
  const { getAnalytics, getSendingActivity, getRecentMessages } = useAIAnalyticsStore();
  
  // Get real analytics data
  const analytics = getAnalytics();
  const sendingActivityData = getSendingActivity();
  const recentMessages = getRecentMessages(10);

  // Refresh messages when component mounts or invoices change
  useEffect(() => {
    // Trigger regeneration by accessing the store
    const store = useAIAnalyticsStore.getState();
    if (store.messages.length === 0) {
      // Messages will be auto-generated on first access
      store.getSendingActivity();
    }
  }, []);

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

      {/* Sending Activity Graph - First */}
      <Card>
        <CardHeader>
          <CardTitle>Siuntimo aktyvumas (statinis grafikas)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={sendingActivityData}
            lines={chartLines}
            xAxisKey="month"
            height={300}
          />
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{analytics.openedRate}%</p>
              <p className="text-sm text-gray-600">Atidarytų žinučių</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{analytics.clickThroughRate}%</p>
              <p className="text-sm text-gray-600">Paspaudimų rodiklis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{analytics.conversionRate}%</p>
              <p className="text-sm text-gray-600">Konversijos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Paskutinės 10 AI žinučių</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length > 0 ? (
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
                {recentMessages.map((message) => (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nėra AI žinučių. Žinutės bus sugeneruotos automatiškai pagal sąskaitų duomenis.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

