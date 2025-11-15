import { useCallback, useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

interface FileUploadAreaProps {
  onFilesSelected: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
}

/**
 * File upload area with drag-and-drop support
 */
export function FileUploadArea({ 
  onFilesSelected, 
  accept = '.csv,.xlsx,.xls',
  multiple = true 
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const fileMetadata = droppedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    setFiles(prev => [...prev, ...fileMetadata]);
    onFilesSelected(droppedFiles);
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const fileMetadata = selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    setFiles(prev => [...prev, ...fileMetadata]);
    onFilesSelected(e.target.files);
  }, [onFilesSelected]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getFileTypeBadge = (fileName: string) => {
    if (fileName.endsWith('.csv')) return 'CSV';
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return 'Excel';
    if (fileName.endsWith('.pdf')) return 'PDF';
    return 'File';
  };

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragging ? 'border-primary bg-primary/5' : 'border-neutral-border'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">Įtempkite failą čia</p>
          <p className="text-xs text-gray-500 mb-4">arba</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
          />
          <Button 
            type="button" 
            variant="primary" 
            size="md" 
            onClick={handleButtonClick}
          >
            Pasirinkti failą
          </Button>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-neutral-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                  {getFileTypeBadge(file.name)}
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
