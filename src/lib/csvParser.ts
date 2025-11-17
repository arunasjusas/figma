/**
 * CSV Parser utility
 * Parses CSV files and converts them to invoice data
 */

export interface ParsedInvoice {
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  dueDate: string;
  notes?: string;
}

export interface ParseResult {
  success: boolean;
  data: ParsedInvoice[];
  errors: string[];
  totalRows: number;
  successCount: number;
  errorCount: number;
}

/**
 * Parse CSV file content
 */
export async function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseCSVText(text);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Nepavyko perskaityti failo'],
        totalRows: 0,
        successCount: 0,
        errorCount: 1,
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Parse CSV text content
 */
function parseCSVText(text: string): ParseResult {
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      success: false,
      data: [],
      errors: ['Failas tuščias'],
      totalRows: 0,
      successCount: 0,
      errorCount: 1,
    };
  }

  const data: ParsedInvoice[] = [];
  const errors: string[] = [];

  // Skip header row
  const dataLines = lines.slice(1);

  dataLines.forEach((line, index) => {
    try {
      const invoice = parseCSVLine(line, index + 2); // +2 because we skip header and arrays are 0-indexed
      if (invoice) {
        data.push(invoice);
      }
    } catch (error) {
      errors.push(`Eilutė ${index + 2}: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`);
    }
  });

  return {
    success: data.length > 0,
    data,
    errors,
    totalRows: dataLines.length,
    successCount: data.length,
    errorCount: errors.length,
  };
}

/**
 * Parse a single CSV line
 * Expected format: number,date,client,amount,status,dueDate,notes
 * Example: SF-101,2025-10-01,MB Balttech,250.00,UNPAID,2025-11-01,Optional notes
 */
function parseCSVLine(line: string, _lineNumber: number): ParsedInvoice | null {
  // Simple CSV parser (handles basic cases, not complex CSV with quotes)
  const values = line.split(',').map(v => v.trim());

  if (values.length < 6) {
    throw new Error('Nepakanka stulpelių (reikia mažiausiai 6)');
  }

  const [number, date, client, amountStr, status, dueDate, ...notesParts] = values;

  // Validate required fields
  if (!number) throw new Error('Trūksta sąskaitos numerio');
  if (!date) throw new Error('Trūksta datos');
  if (!client) throw new Error('Trūksta kliento');
  if (!amountStr) throw new Error('Trūksta sumos');
  if (!status) throw new Error('Trūksta statuso');
  if (!dueDate) throw new Error('Trūksta mokėjimo termino');

  // Parse amount
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Netinkama suma');
  }

  // Validate status
  const validStatuses = ['PAID', 'UNPAID', 'PENDING'];
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new Error(`Netinkamas statusas: ${status} (turi būti PAID, UNPAID arba PENDING)`);
  }

  // Validate dates
  if (!isValidDate(date)) {
    throw new Error('Netinkama data');
  }
  if (!isValidDate(dueDate)) {
    throw new Error('Netinkamas mokėjimo terminas');
  }

  return {
    number,
    date,
    client,
    amount,
    status: status.toUpperCase() as 'PAID' | 'UNPAID' | 'PENDING',
    dueDate,
    notes: notesParts.length > 0 ? notesParts.join(',').trim() : undefined,
  };
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Generate sample CSV content for invoices download
 */
export function generateSampleCSV(): string {
  const header = 'number,date,client,amount,status,dueDate,notes';
  const examples = [
    'SF-101,2025-10-01,MB Balttech,250.00,UNPAID,2025-11-01,',
    'SF-102,2025-10-02,UAB Ratai,450.00,PAID,2025-11-02,',
    'SF-103,2025-10-03,UAB Sodas,1500.00,PENDING,2025-12-15,Papildoma informacija',
  ];

  return [header, ...examples].join('\n');
}

/**
 * Generate sample CSV content for clients download
 */
export function generateClientSampleCSV(): string {
  const header = 'name,email,phone,address,taxId';
  const examples = [
    'MB Balttech,info@balttech.lt,+370 600 11111,Vilnius Gedimino pr. 1,123456789',
    'UAB Ratai,kontaktai@ratai.lt,+370 600 22222,Kaunas Laisvės al. 10,987654321',
    'UAB Sodas,info@sodas.lt,+370 600 33333,Klaipėda Taikos pr. 5,',
    'MB Technika,technika@technika.lt,+370 600 44444,,',
  ];

  return [header, ...examples].join('\n');
}

/**
 * Parsed Client interface
 */
export interface ParsedClient {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface ParseClientResult {
  success: boolean;
  data: ParsedClient[];
  errors: string[];
  totalRows: number;
  successCount: number;
  errorCount: number;
}

/**
 * Parse client CSV file content
 */
export async function parseClientCSVFile(file: File): Promise<ParseClientResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseClientCSVText(text);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Nepavyko perskaityti failo'],
        totalRows: 0,
        successCount: 0,
        errorCount: 1,
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Parse client CSV text content
 * Expected format: name,email,phone,address,taxId
 * Example: MB Balttech,info@balttech.lt,+370 600 11111,Vilnius,123456789
 */
function parseClientCSVText(text: string): ParseClientResult {
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      success: false,
      data: [],
      errors: ['Failas tuščias'],
      totalRows: 0,
      successCount: 0,
      errorCount: 1,
    };
  }

  const data: ParsedClient[] = [];
  const errors: string[] = [];

  // Skip header row
  const dataLines = lines.slice(1);

  dataLines.forEach((line, index) => {
    try {
      const client = parseClientCSVLine(line, index + 2);
      if (client) {
        data.push(client);
      }
    } catch (error) {
      errors.push(`Eilutė ${index + 2}: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`);
    }
  });

  return {
    success: data.length > 0,
    data,
    errors,
    totalRows: dataLines.length,
    successCount: data.length,
    errorCount: errors.length,
  };
}

/**
 * Parse a single client CSV line
 * Expected format: name,email,phone,address,taxId
 */
function parseClientCSVLine(line: string, _lineNumber: number): ParsedClient | null {
  const values = line.split(',').map(v => v.trim());

  if (values.length < 1) {
    throw new Error('Nepakanka stulpelių (reikia mažiausiai 1 - kliento vardas)');
  }

  const [name, email, phone, address, taxId] = values;

  // Validate required field
  if (!name) throw new Error('Trūksta kliento vardo');

  return {
    name,
    email: email || undefined,
    phone: phone || undefined,
    address: address || undefined,
    taxId: taxId || undefined,
  };
}

