import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileUploadArea } from '@/components/shared/FileUploadArea';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Download, X } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { parseCSVFile, generateSampleCSV } from '@/lib/csvParser';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useClientStore } from '@/store/clientStore';
import { useToastStore } from '@/components/ui/Toast';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  file: File;
}

/**
 * CSV Upload page - "CSV Įkėlimas"
 * Handles CSV file upload and parsing for invoices
 */
export default function CsvUploadPage() {
  usePageTitle('CSV Įkėlimas');
  
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [fileType, setFileType] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [duplicateInvoices, setDuplicateInvoices] = useState<string[]>([]);
  const [newInvoices, setNewInvoices] = useState<string[]>([]);

  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const clients = useClientStore((state) => state.clients);
  const addClient = useClientStore((state) => state.addClient);
  const addToast = useToastStore((state) => state.addToast);

  const handleFilesSelected = (files: Array<{ name: string; type: string; size: number }>) => {
    // Store actual File objects
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      const uploadedFiles: UploadedFile[] = Array.from(fileInput.files).map((file, index) => ({
        name: files[index]?.name || file.name,
        type: files[index]?.type || file.type,
        size: files[index]?.size || file.size,
        file: file,
      }));
      setSelectedFiles(uploadedFiles);
    }
    setImportStatus('idle');
    setErrorMessages([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (selectedFiles.length === 0 || !fileType) {
      addToast({
        type: 'error',
        title: 'Įkėlimas nesėkmingas',
        message: 'Prašome pasirinkti failą ir failo tipą',
      });
      return;
    }

    if (fileType !== 'invoices') {
      addToast({
        type: 'error',
        title: 'Įkėlimas nesėkmingas',
        message: 'Šiuo metu palaikomas tik sąskaitų importas',
      });
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);
    setErrorMessages([]);
    setDuplicateInvoices([]);
    setNewInvoices([]);
    setSkippedCount(0);

    try {
      let totalImported = 0;
      let totalSkipped = 0;
      const allErrors: string[] = [];
      const duplicates: string[] = [];
      const newOnes: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress
        setImportProgress(Math.round(((i + 0.5) / selectedFiles.length) * 100));

        // Parse CSV file
        const result = await parseCSVFile(file.file);

        if (result.success && result.data.length > 0) {
          // Collect unique client names from CSV
          const uniqueClientNames = new Set<string>();
          result.data.forEach((invoiceData) => {
            uniqueClientNames.add(invoiceData.client.toLowerCase());
          });
          
          // Add new clients that don't exist yet
          uniqueClientNames.forEach((clientNameLower) => {
            const clientExists = clients.some(
              (c) => c.name.toLowerCase() === clientNameLower
            );
            
            if (!clientExists) {
              // Find the original case-sensitive name from the data
              const originalName = result.data.find(
                (inv) => inv.client.toLowerCase() === clientNameLower
              )?.client || '';
              
              // Add new client from invoice data
              addClient({
                name: originalName,
                email: '', // CSV doesn't have email, can be added later
                phone: '', // CSV doesn't have phone, can be added later
              });
            }
          });
          
          // Check for duplicates and add only new invoices
          result.data.forEach((invoiceData) => {
            // Check if invoice with same number already exists
            const isDuplicate = allInvoices.some(
              (existingInv) => existingInv.number.toLowerCase() === invoiceData.number.toLowerCase()
            );
            
            if (isDuplicate) {
              // Skip duplicate
              totalSkipped++;
              duplicates.push(`${invoiceData.number} (${invoiceData.client}, ${invoiceData.amount}€)`);
            } else {
              // Add new invoice
              addInvoice(invoiceData);
              totalImported++;
              newOnes.push(`${invoiceData.number} (${invoiceData.client}, ${invoiceData.amount}€)`);
            }
          });
        }

        if (result.errors.length > 0) {
          allErrors.push(`${file.name}: ${result.errors.join(', ')}`);
        }

        // Update progress
        setImportProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      setImportedCount(totalImported);
      setSkippedCount(totalSkipped);
      setErrorMessages(allErrors);
      setDuplicateInvoices(duplicates);
      setNewInvoices(newOnes);

      if (totalImported > 0 || totalSkipped > 0) {
        setImportStatus('success');
        
        let message = '';
        if (totalImported > 0 && totalSkipped > 0) {
          message = `Importuota ${totalImported} naujų sąskaitų. Praleista ${totalSkipped} dublikatų.`;
        } else if (totalImported > 0) {
          message = `Sėkmingai importuota ${totalImported} sąskaitų`;
        } else {
          message = `Visos sąskaitos (${totalSkipped}) jau egzistuoja sistemoje`;
        }
        
        addToast({
          type: 'success',
          title: 'Įkėlimas baigtas',
          message,
        });
      } else {
        setImportStatus('error');
        addToast({
          type: 'error',
          title: 'Įkėlimas nesėkmingas',
          message: 'Nepavyko importuoti jokių sąskaitų. Patikrinkite failo formatą.',
        });
      }
    } catch (error) {
      setImportStatus('error');
      setErrorMessages([error instanceof Error ? error.message : 'Nežinoma klaida']);
      addToast({
        type: 'error',
        title: 'Įkėlimas nesėkmingas',
        message: 'Įvyko klaida apdorojant failą',
      });
    }
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saskaitos_pavyzdys.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            importStatus === 'idle' || importStatus === 'importing' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <span className="hidden md:inline">Įkelti failą</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            importStatus === 'importing' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className="hidden md:inline">Patikrinti duomenis</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            importStatus === 'success' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <span className="hidden md:inline">Baigta</span>
        </div>
      </div>

      {/* File Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Failų įkėlimas</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadArea
            onFilesSelected={handleFilesSelected}
            accept=".csv,.xlsx,.xls"
            multiple={true}
          />

          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* File List */}
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.type === 'text/csv' ? 'CSV' : file.type === 'application/vnd.ms-excel' || file.type.includes('spreadsheet') ? 'Excel' : file.type}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      disabled={importStatus === 'importing'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasirinkite failo tipą
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={importStatus === 'importing'}
                >
                  <option value="">Pasirinkite...</option>
                  <option value="invoices">Sąskaitos</option>
                  <option value="clients">Klientai</option>
                  <option value="products">Produktai</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">PVZ: Pasirinkite "Sąskaitos" jei importuojate sąskaitų duomenis</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={importStatus === 'importing' || !fileType}
                  className="flex-1 md:flex-none"
                >
                  {importStatus === 'importing' ? 'Importuojama...' : 'Pradėti importą'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadSample}
                  disabled={importStatus === 'importing'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Atsisiųsti pavyzdį
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Progress */}
      {importStatus === 'importing' && (
        <Card>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vykdomas importas</span>
                <span className="text-sm font-semibold text-primary">{importProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Success */}
      {importStatus === 'success' && (
        <Card>
          <CardContent>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-status-paid flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Importas baigtas!</h3>
                
                {/* Summary */}
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  {importedCount > 0 && (
                    <p>✓ Sėkmingai importuota <strong>{importedCount}</strong> naujų sąskaitų</p>
                  )}
                  {skippedCount > 0 && (
                    <p>⚠ Praleista <strong>{skippedCount}</strong> dublikatų (jau egzistuoja sistemoje)</p>
                  )}
                </div>

                {/* New Invoices */}
                {newInvoices.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-900 mb-2">Importuotos naujos sąskaitos:</p>
                    <ul className="text-xs text-green-800 space-y-1 max-h-40 overflow-y-auto">
                      {newInvoices.slice(0, 10).map((invoice, i) => (
                        <li key={i}>✓ {invoice}</li>
                      ))}
                      {newInvoices.length > 10 && (
                        <li className="font-medium">+ dar {newInvoices.length - 10} sąskaitų...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Duplicate Invoices */}
                {duplicateInvoices.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium text-yellow-900 mb-2">Praleistos sąskaitos (dublikatai):</p>
                    <ul className="text-xs text-yellow-800 space-y-1 max-h-40 overflow-y-auto">
                      {duplicateInvoices.slice(0, 10).map((invoice, i) => (
                        <li key={i}>⚠ {invoice}</li>
                      ))}
                      {duplicateInvoices.length > 10 && (
                        <li className="font-medium">+ dar {duplicateInvoices.length - 10} dublikatų...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Errors */}
                {errorMessages.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-900 mb-1">Klaidos:</p>
                    <ul className="text-xs text-red-800 space-y-1">
                      {errorMessages.slice(0, 5).map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                      {errorMessages.length > 5 && (
                        <li>• Ir dar {errorMessages.length - 5} klaidų...</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportStatus('idle');
                      setSelectedFiles([]);
                      setFileType('');
                      setImportProgress(0);
                      setImportedCount(0);
                      setSkippedCount(0);
                      setErrorMessages([]);
                      setDuplicateInvoices([]);
                      setNewInvoices([]);
                    }}
                  >
                    Įkelti kitą failą
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Error */}
      {importStatus === 'error' && (
        <Card>
          <CardContent>
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-status-unpaid flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Įkėlimas nesėkmingas</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ✕ Įvyko klaida. Patikrinkite failo formatą arba bandykite iš naujo.
                </p>
                {errorMessages.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-900 mb-1">Klaidos:</p>
                    <ul className="text-xs text-red-800 space-y-1">
                      {errorMessages.slice(0, 5).map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                      {errorMessages.length > 5 && (
                        <li>• Ir dar {errorMessages.length - 5} klaidų...</li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleImport}
                  >
                    Bandyti dar kartą
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportStatus('idle');
                      setSelectedFiles([]);
                      setFileType('');
                      setImportProgress(0);
                      setErrorMessages([]);
                    }}
                  >
                    Atšaukti
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

