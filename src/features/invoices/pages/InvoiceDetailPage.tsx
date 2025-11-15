import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockInvoices } from '@/lib/mockData';
import { Download, Send, ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';

/**
 * Invoice detail page
 */
export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const invoice = mockInvoices.find(inv => inv.id === id);
  const [aiMessageSubject, setAiMessageSubject] = useState('Priminimas dėl sąskaitos');
  const [aiMessageBody, setAiMessageBody] = useState(
    'Gerbiamas kliente,\n\nPrimename apie jūsų sąskaitą. Prašome apmokėti iki nurodyto termino.\n\nAčiū už bendradarbiavimą!'
  );

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Sąskaita nerasta</p>
        <Link to="/invoices">
          <Button variant="primary" className="mt-4">
            Grįžti į sąrašą
          </Button>
        </Link>
      </div>
    );
  }

  const remainingAmount = invoice.amount - (invoice.paidAmount || 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/invoices">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Grįžti į sąrašą
        </Button>
      </Link>

      {/* Invoice Information */}
      <Card>
        <CardHeader>
          <CardTitle>Sąskaitos informacija</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Užsakovas</p>
                <p className="font-semibold text-lg">{invoice.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sąskaitos numeris</p>
                <p className="font-semibold">{invoice.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Išrašymo data</p>
                <p className="font-semibold">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Apmokėjimo terminas</p>
                <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Statusas</p>
                <div className="mt-1">
                  <InvoiceStatusPill status={invoice.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bendra suma</p>
                <p className="font-bold text-2xl text-gray-900">{formatCurrency(invoice.amount)}</p>
              </div>
              {invoice.paidAmount !== undefined && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Sumokėta</p>
                    <p className="font-semibold text-lg text-status-paid">{formatCurrency(invoice.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Likusi suma</p>
                    <p className="font-semibold text-lg text-status-unpaid">{formatCurrency(remainingAmount)}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {invoice.attachment && (
            <div className="mt-6 pt-6 border-t border-neutral-border">
              <p className="text-sm text-gray-600 mb-2">Prisegta sutartis</p>
              <div className="flex items-center gap-3">
                <span className="font-medium">{invoice.attachment.name}</span>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Atsisiųsti
                </Button>
              </div>
            </div>
          )}

          {invoice.notes && (
            <div className="mt-6 pt-6 border-t border-neutral-border">
              <p className="text-sm text-gray-600 mb-2">Pastabos</p>
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-neutral-border flex flex-wrap gap-3">
            <Button variant="primary">
              <Send className="w-4 h-4 mr-2" />
              Siųsti AI pranešimą
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Atsisiųsti sąskaitą PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Message Preview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Žinutės Peržiūra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tema
              </label>
              <input
                type="text"
                value={aiMessageSubject}
                onChange={(e) => setAiMessageSubject(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Žinutės turinys
              </label>
              <textarea
                value={aiMessageBody}
                onChange={(e) => setAiMessageBody(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Redaguoti
              </Button>
              <Button variant="primary">
                Patvirtinti ir siųsti
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

