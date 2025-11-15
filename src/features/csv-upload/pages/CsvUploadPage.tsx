import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileUploadArea } from '@/components/shared/FileUploadArea';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * CSV Upload page - "CSV Įkėlimas"
 */
export default function CsvUploadPage() {
  usePageTitle('CSV Įkėlimas');
  
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; type: string; size: number }>>([]);
  const [fileType, setFileType] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const handleFilesSelected = (files: Array<{ name: string; type: string; size: number }>) => {
    setSelectedFiles(files);
    setImportStatus('idle');
  };

  const handleImport = () => {
    if (selectedFiles.length === 0 || !fileType) {
      alert('Prašome pasirinkti failą ir failo tipą');
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Randomly succeed or fail for demo
          setImportStatus(Math.random() > 0.3 ? 'success' : 'error');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasirinkite failo tipą
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pasirinkite...</option>
                  <option value="invoices">Sąskaitos</option>
                  <option value="clients">Klientai</option>
                  <option value="products">Produktai</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">PVZ: Pasirinkite "Sąskaitos" jei importuojate sąskaitų duomenis</p>
              </div>

              <Button
                variant="primary"
                onClick={handleImport}
                disabled={importStatus === 'importing'}
                className="w-full md:w-auto"
              >
                {importStatus === 'importing' ? 'Importuojama...' : 'Pradėti importą'}
              </Button>
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
              <div>
                <h3 className="font-semibold text-lg mb-1">Importas sėkmingas!</h3>
                <p className="text-sm text-gray-600">
                  Duomenys sėkmingai apdoroti ir pridėti į sistemą. ✓
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportStatus('idle');
                      setSelectedFiles([]);
                      setFileType('');
                      setImportProgress(0);
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
              <div>
                <h3 className="font-semibold text-lg mb-1">Įkėlimas nesėkmingas</h3>
                <p className="text-sm text-gray-600">
                  ✕ Įvyko klaida. Patikrinkite failo formatą arba bandykite iš naujo.
                </p>
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

