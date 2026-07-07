export interface School {
  id: string;
  name: string;
  zone?: string;
  province?: string;
}

export interface SubjectAttempt {
  subjectNumber: string;
  grade: string; // Normalized to A, B, C, S, W, AB
  sourceColumn: string;
}

export interface StudentRow {
  rowNumber: number;
  schoolId: string;
  schoolName: string;
  zone?: string;
  province?: string;
  attempts: SubjectAttempt[];
}

export interface ValidationWarning {
  rowNumber?: number;
  message: string;
  severity: 'warning' | 'error';
  type: 'invalid_grade' | 'missing_grade' | 'invalid_subject' | 'other';
  sourceColumn?: string;
  rawData?: any;
}

export interface ResultStats {
  schoolId: string;
  schoolName: string;
  subjectNumber: string;
  totalDid: number;
  satCount: number;
  absentCount: number;
  aCount: number;
  bCount: number;
  cCount: number;
  sCount: number;
  wCount: number;
  passCount: number;
  failCount: number;
  
  aPercentage: string;
  bPercentage: string;
  cPercentage: string;
  sPercentage: string;
  wPercentage: string;
  passPercentage: string;
  absentPercentage: string;
}

export interface ProcessedData {
  schools: Record<string, School>;
  students: StudentRow[];
  warnings: ValidationWarning[];
  totalRowsRead: number;
  parsedAttemptsCount: number;
  sheetName: string;
  headerRowIndex: number;
  fixedSubjectMappings: string[];
  groupSubjectMappings: string[];
  ignoredColumnsCount: number;
}
