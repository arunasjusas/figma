import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileUploadArea } from '@/components/shared/FileUploadArea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CheckCircle, XCircle, Download, X } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { parseCSVFile, generateSampleCSV, generateClientSampleCSV, parseClientCSVFile } from '@/lib/csvParser';
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
  const [duplicateClients, setDuplicateClients] = useState<string[]>([]);
  const [newClients, setNewClients] = useState<string[]>([]);

  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const clients = useClientStore((state) => state.clients);
  const addClient = useClientStore((state) => state.addClient);
  const addToast = useToastStore((state) => state.addToast);

  const handleFilesSelected = (fileList: FileList | File[]) => {
    // Convert FileList or File[] to our UploadedFile format
    const uploadedFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
    }));
    setSelectedFiles(uploadedFiles);
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

    if (fileType !== 'invoices' && fileType !== 'clients') {
      addToast({
        type: 'error',
        title: 'Įkėlimas nesėkmingas',
        message: 'Prašome pasirinkti failo tipą',
      });
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);
    setErrorMessages([]);
    setDuplicateInvoices([]);
    setNewInvoices([]);
    setDuplicateClients([]);
    setNewClients([]);
    setSkippedCount(0);

    try {
      let totalImported = 0;
      let totalSkipped = 0;
      const allErrors: string[] = [];
      const duplicates: string[] = [];
      const newOnes: string[] = [];
      const duplicateClientNames: string[] = [];
      const newClientNames: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress
        setImportProgress(Math.round(((i + 0.5) / selectedFiles.length) * 100));

        if (fileType === 'invoices') {
          // Parse invoice CSV file
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
                await addClient({
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
                await addInvoice(invoiceData);
                totalImported++;
                newOnes.push(`${invoiceData.number} (${invoiceData.client}, ${invoiceData.amount}€)`);
              }
            });
          }

          if (result.errors.length > 0) {
            allErrors.push(`${file.name}: ${result.errors.join(', ')}`);
          }
        } else if (fileType === 'clients') {
          // Parse client CSV file
          const result = await parseClientCSVFile(file.file);

          if (result.success && result.data.length > 0) {
            // Check for duplicates and add only new clients
            result.data.forEach((clientData) => {
              // Check if client with same name already exists (case-insensitive)
              const isDuplicate = clients.some(
                (existingClient) => existingClient.name.toLowerCase() === clientData.name.toLowerCase()
              );
              
              if (isDuplicate) {
                // Skip duplicate
                totalSkipped++;
                duplicateClientNames.push(clientData.name);
              } else {
                // Add new client
                await addClient({
                  name: clientData.name,
                  email: clientData.email || '',
                  phone: clientData.phone || '',
                  address: clientData.address,
                  taxId: clientData.taxId,
                });
                totalImported++;
                newClientNames.push(clientData.name);
              }
            });
          }

          if (result.errors.length > 0) {
            allErrors.push(`${file.name}: ${result.errors.join(', ')}`);
          }
        }

        // Update progress
        setImportProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      setImportedCount(totalImported);
      setSkippedCount(totalSkipped);
      setErrorMessages(allErrors);
      setDuplicateInvoices(duplicates);
      setNewInvoices(newOnes);
      setDuplicateClients(duplicateClientNames);
      setNewClients(newClientNames);

      if (totalImported > 0 || totalSkipped > 0) {
        setImportStatus('success');
        
        let message = '';
        if (fileType === 'invoices') {
          if (totalImported > 0 && totalSkipped > 0) {
            message = `Importuota ${totalImported} naujų sąskaitų. Praleista ${totalSkipped} dublikatų.`;
          } else if (totalImported > 0) {
            message = `Sėkmingai importuota ${totalImported} sąskaitų`;
          } else {
            message = `Visos sąskaitos (${totalSkipped}) jau egzistuoja sistemoje`;
          }
        } else if (fileType === 'clients') {
          if (totalImported > 0 && totalSkipped > 0) {
            message = `Importuota ${totalImported} naujų klientų. Praleista ${totalSkipped} dublikatų.`;
          } else if (totalImported > 0) {
            message = `Sėkmingai importuota ${totalImported} klientų`;
          } else {
            message = `Visi klientai (${totalSkipped}) jau egzistuoja sistemoje`;
          }
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
          message: fileType === 'invoices' 
            ? 'Nepavyko importuoti jokių sąskaitų. Patikrinkite failo formatą.'
            : 'Nepavyko importuoti jokių klientų. Patikrinkite failo formatą.',
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
    if (!fileType) return;
    
    const csv = fileType === 'clients' ? generateClientSampleCSV() : generateSampleCSV();
    const filename = fileType === 'clients' ? 'klientai_pavyzdys.csv' : 'saskaitos_pavyzdys.csv';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
          {/* File Type Selection - Always visible */}
          <div className="mb-6">
            <Select
              label="Pasirinkite failo tipą"
              value={fileType}
              onChange={(value) => setFileType(value)}
              options={[
                { value: '', label: 'Pasirinkite...' },
                { value: 'invoices', label: 'Sąskaitos' },
                { value: 'clients', label: 'Klientai' },
              ]}
              placeholder="Pasirinkite..."
              disabled={importStatus === 'importing'}
              fullWidth
            />
            <p className="text-xs text-gray-500 mt-1">PVZ: Pasirinkite "Sąskaitos" jei importuojate sąskaitų duomenis</p>
          </div>

          <FileUploadArea
            onFilesSelected={handleFilesSelected}
            accept=".csv,.xlsx,.xls"
            multiple={true}
          />

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-2">
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
          )}

          {/* Action Buttons - Always visible */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={importStatus === 'importing' || !fileType || selectedFiles.length === 0}
              className="flex-1 md:flex-none"
            >
              {importStatus === 'importing' ? 'Importuojama...' : 'Pradėti importą'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              disabled={importStatus === 'importing' || !fileType}
            >
              <Download className="w-4 h-4 mr-2" />
              Atsisiųsti pavyzdį
            </Button>
          </div>
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
                    <p>✓ Sėkmingai importuota <strong>{importedCount}</strong> {fileType === 'invoices' ? 'naujų sąskaitų' : 'naujų klientų'}</p>
                  )}
                  {skippedCount > 0 && (
                    <p>⚠ Praleista <strong>{skippedCount}</strong> dublikatų (jau egzistuoja sistemoje)</p>
                  )}
                </div>

                {/* New Invoices */}
                {fileType === 'invoices' && newInvoices.length > 0 && (
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

                {/* New Clients */}
                {fileType === 'clients' && newClients.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-900 mb-2">Importuoti nauji klientai:</p>
                    <ul className="text-xs text-green-800 space-y-1 max-h-40 overflow-y-auto">
                      {newClients.slice(0, 10).map((client, i) => (
                        <li key={i}>✓ {client}</li>
                      ))}
                      {newClients.length > 10 && (
                        <li className="font-medium">+ dar {newClients.length - 10} klientų...</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Duplicate Invoices */}
                {fileType === 'invoices' && duplicateInvoices.length > 0 && (
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

                {/* Duplicate Clients */}
                {fileType === 'clients' && duplicateClients.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium text-yellow-900 mb-2">Praleisti klientai (dublikatai):</p>
                    <ul className="text-xs text-yellow-800 space-y-1 max-h-40 overflow-y-auto">
                      {duplicateClients.slice(0, 10).map((client, i) => (
                        <li key={i}>⚠ {client}</li>
                      ))}
                      {duplicateClients.length > 10 && (
                        <li className="font-medium">+ dar {duplicateClients.length - 10} dublikatų...</li>
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
                      setDuplicateClients([]);
                      setNewClients([]);
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

