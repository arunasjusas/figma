import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/lib/utils';
import { mockAIMessages } from '@/lib/mockData';
import { AI_MESSAGE_STATUS_LABELS } from '@/lib/constants';

/**
 * Analytics tab component for AI Automation
 */
export function AnalyticsTab() {
  return (
    <div className="space-y-6">
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
                      message.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                      message.status === 'OPENED' ? 'bg-green-100 text-green-700' :
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

