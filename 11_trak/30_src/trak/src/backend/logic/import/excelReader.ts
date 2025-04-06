import * as XLSX from 'xlsx';
import { Project } from '../../models/project';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface RawTicketData {
  id?: string;
  tags: string[];
  title: string;
  assignees: string[];
  estimate?: number;
  progress?: number;
  status: string;
  startDate?: string;
  dueDate?: string;
  content?: string;
}

const REQUIRED_SHEETS = ['WBS'];

/**
 * インポートファイルの基本検証
 */
export async function validateImportFile(file: ArrayBuffer): Promise<ValidationResult> {
  try {

    // Excel形式チェック
    const workbook = XLSX.read(file, { type: 'array' });
    
    // 必要なシートの存在確認
    const missingSheets = REQUIRED_SHEETS.filter(sheet => !workbook.SheetNames.includes(sheet));
    if (missingSheets.length > 0) {
      return {
        isValid: false,
        error: `必要なシート [${missingSheets.join(', ')}] が見つかりません`
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "不正なExcelファイル形式です"
    };
  }
}

/**
 * プロジェクト情報の読み込み
 */
export async function readProjectFromExcel(file: ArrayBuffer): Promise<Partial<Project>> {
  const workbook = XLSX.read(file, { type: 'array' });
  const sheet = workbook.Sheets['WBS'];

  // セル参照を使用して値を取得
  const getValue = (address: string) => {
    const cell = sheet[address];
    return cell ? cell.v : undefined;
  };
  
  return {
    id: getValue('D1'),
    name: getValue('D2'),
    beginDate: getValue('I1'),
    endDate: getValue('I2'),
  };
}

/**
 * チケット情報の読み込み
 */
export async function readTicketsFromExcel(file: ArrayBuffer): Promise<RawTicketData[]> {
  const workbook = XLSX.read(file, { type: 'array' });
  const sheet = workbook.Sheets['WBS'];
  
  // ヘッダー行以降のデータを取得（5行目から）
  interface ExcelRow {
    id?: string;
    tag1?: string;
    tag2?: string;
    title?: string;
    assignees?: string | number;
    estimate?: number;
    progress?: number;
    status?: string;
    startDate?: number;
    dueDate?: number;
  }

  const data = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { 
    header: ['id', 'tag1', 'tag2', 'title', 'assignees', 'estimate', 'progress', 'status', 'startDate', 'dueDate'],
    range: 4 
  });
  
  // 必須項目（title, status）のチェックと型変換を行う
  return data
    .filter((row): row is Required<Pick<ExcelRow, 'title' | 'status'>> & ExcelRow => 
      Boolean(row.title && row.status)
    )
    .map((row) => ({
      id: row.id,
      tags: [row.tag1, row.tag2].filter((tag): tag is string => Boolean(tag)),
      title: row.title,
      assignees: row.assignees ? String(row.assignees).split(':').map(s => s.trim()) : [],
      estimate: row.estimate,
      progress: row.progress,
      status: row.status,
      startDate: formatExcelDate(row.startDate),
      dueDate: formatExcelDate(row.dueDate),
      content: '', // 新規作成時のデフォルト値
    }));
}

/**
 * Excel日付形式を文字列に変換
 */
function formatExcelDate(excelDate: number | undefined): string | undefined {
  if (!excelDate) return undefined;

  // Excelの日付を文字列に変換（1900年1月1日からの経過日数）
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  return date.toISOString().split('T')[0];
}
