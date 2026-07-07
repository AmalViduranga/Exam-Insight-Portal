import * as XLSX from "xlsx";
import type { ProcessedData, School, StudentRow, SubjectAttempt, ValidationWarning } from "./types";
import { normalizeGrade, parseSubjectNumber } from "./subjectParser";

const FIXED_SUBJECT_HEADERS = [
  "religion",
  "language & literature",
  "english language",
  "science",
  "mathematics",
  "history"
];

const GROUP_SUBJECT_HEADERS = [
  "1st subject group",
  "2nd subject group",
  "3rd subject group"
];

export function parseExcelBuffer(buffer: ArrayBuffer, sheetName?: string): { data?: ProcessedData, sheets: string[] } {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets = workbook.SheetNames;

  if (sheets.length === 0) {
    throw new Error("No sheets found in the Excel file.");
  }

  const targetSheetName = sheetName && sheets.includes(sheetName) ? sheetName : sheets[0];
  const worksheet = workbook.Sheets[targetSheetName];
  
  // Use array of arrays mode to avoid __EMPTY keys and preserve order
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

  let headerRowIndex = -1;
  let headers: string[] = [];

  // Find header row
  for (let i = 0; i < Math.min(30, rawRows.length); i++) {
    const row = rawRows[i];
    if (!row) continue;
    const stringRow = row.map(c => String(c || '').toLowerCase().trim());
    if (stringRow.some(c => c === "school id" || c === "school name" || c === "religion")) {
      headerRowIndex = i;
      headers = row.map(c => String(c || '').trim());
      break;
    }
  }

  if (headerRowIndex === -1) {
    throw new Error("Could not find a valid header row containing 'School ID', 'School Name', or 'Religion'.");
  }

  // Identify column indexes
  let colSchoolId = -1;
  let colSchoolName = -1;
  let colZone = -1;
  let colProvince = -1;

  interface FixedMap {
    textCol: number;
    gradeCol: number;
    name: string;
  }
  
  interface GroupMap {
    textCol: number;
    subjectNoCol: number;
    gradeCol: number;
    name: string;
  }

  const fixedMaps: FixedMap[] = [];
  const groupMaps: GroupMap[] = [];

  const headersLower = headers.map(h => h.toLowerCase());

  headersLower.forEach((h, i) => {
    if (h === "school id") colSchoolId = i;
    else if (h === "school name") colSchoolName = i;
    else if (h === "zone") colZone = i;
    else if (h === "province") colProvince = i;

    // Check fixed subjects
    if (FIXED_SUBJECT_HEADERS.includes(h)) {
      // Expect next column to be the grade
      fixedMaps.push({
        textCol: i,
        gradeCol: i + 1,
        name: headers[i]
      });
    }

    // Check subject groups
    if (GROUP_SUBJECT_HEADERS.includes(h)) {
      // Expect next column to be subject number, next to be grade
      groupMaps.push({
        textCol: i,
        subjectNoCol: i + 1,
        gradeCol: i + 2,
        name: headers[i]
      });
    }
  });

  const students: StudentRow[] = [];
  const schools: Record<string, School> = {};
  const warnings: ValidationWarning[] = [];
  let parsedAttemptsCount = 0;
  let totalRowsRead = 0;

  for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0 || row.every(c => c == null || c === '')) {
      continue; // skip empty rows
    }
    
    // Ignore summary/total rows
    if (String(row[colSchoolName] || '').toLowerCase().includes("total") || 
        String(row[colSchoolId] || '').toLowerCase().includes("total")) {
      continue;
    }

    totalRowsRead++;

    let schoolId = colSchoolId !== -1 ? String(row[colSchoolId] || '').trim() : "";
    let schoolName = colSchoolName !== -1 ? String(row[colSchoolName] || '').trim() : "";
    let zone = colZone !== -1 ? String(row[colZone] || '').trim() : undefined;
    let province = colProvince !== -1 ? String(row[colProvince] || '').trim() : undefined;

    if (!schoolId && !schoolName) {
      warnings.push({
        rowNumber: i + 1,
        severity: "warning",
        type: "other",
        message: "Row is missing School ID and School Name. Skipping.",
      });
      continue;
    }

    if (!schoolId) schoolId = schoolName; 
    if (!schoolName) schoolName = schoolId;

    if (!schools[schoolId]) {
      schools[schoolId] = { id: schoolId, name: schoolName, zone, province };
    }

    const attempts: SubjectAttempt[] = [];
    const seenSubjects = new Set<string>();

    // Process Fixed Subjects
    for (const map of fixedMaps) {
      const textVal = String(row[map.textCol] || '').trim();
      const gradeVal = String(row[map.gradeCol] || '').trim();

      if (!textVal && !gradeVal) continue;

      const subNum = parseSubjectNumber(textVal);
      const grade = normalizeGrade(gradeVal);

      if (subNum && grade) {
        if (seenSubjects.has(subNum)) {
          warnings.push({ rowNumber: i + 1, severity: "warning", type: "other", message: `Duplicate subject number ${subNum} found in ${map.name}.`, sourceColumn: map.name });
        } else {
          attempts.push({ subjectNumber: subNum, grade, sourceColumn: map.name });
          seenSubjects.add(subNum);
          parsedAttemptsCount++;
        }
      } else if (subNum && !grade) {
        warnings.push({ rowNumber: i + 1, severity: "warning", type: "missing_grade", message: `Subject number ${subNum} exists but grade is missing or invalid.`, sourceColumn: map.name });
      } else if (!subNum && grade) {
        warnings.push({ rowNumber: i + 1, severity: "warning", type: "invalid_subject", message: `Grade '${gradeVal}' exists but subject number cannot be parsed from '${textVal}'.`, sourceColumn: map.name });
      }
    }

    // Process Group Subjects
    for (const map of groupMaps) {
      const textVal = String(row[map.textCol] || '').trim();
      const noVal = String(row[map.subjectNoCol] || '').trim();
      const gradeVal = String(row[map.gradeCol] || '').trim();

      if (!textVal && !noVal && !gradeVal) continue;

      let subNum = parseSubjectNumber(noVal);
      // Fallback to extracting from the text column if the subject number column is empty
      if (!subNum) {
        subNum = parseSubjectNumber(textVal);
      }

      const grade = normalizeGrade(gradeVal);

      if (subNum && grade) {
        if (seenSubjects.has(subNum)) {
          warnings.push({ rowNumber: i + 1, severity: "warning", type: "other", message: `Duplicate subject number ${subNum} found in ${map.name}.`, sourceColumn: map.name });
        } else {
          attempts.push({ subjectNumber: subNum, grade, sourceColumn: map.name });
          seenSubjects.add(subNum);
          parsedAttemptsCount++;
        }
      } else if (subNum && !grade) {
        warnings.push({ rowNumber: i + 1, severity: "warning", type: "missing_grade", message: `Subject number ${subNum} exists but grade is missing or invalid.`, sourceColumn: map.name });
      } else if (!subNum && grade) {
        warnings.push({ rowNumber: i + 1, severity: "warning", type: "invalid_subject", message: `Grade '${gradeVal}' exists but subject number cannot be parsed.`, sourceColumn: map.name });
      }
    }

    if (attempts.length > 9) {
      warnings.push({ rowNumber: i + 1, severity: "warning", type: "other", message: `Row has ${attempts.length} subject attempts, which exceeds the typical maximum of 9.` });
    }

    students.push({
      rowNumber: i + 1,
      schoolId,
      schoolName,
      zone,
      province,
      attempts
    });
  }

  const mappedCols = new Set<number>();
  if (colSchoolId !== -1) mappedCols.add(colSchoolId);
  if (colSchoolName !== -1) mappedCols.add(colSchoolName);
  if (colZone !== -1) mappedCols.add(colZone);
  if (colProvince !== -1) mappedCols.add(colProvince);
  fixedMaps.forEach(m => { mappedCols.add(m.textCol); mappedCols.add(m.gradeCol); });
  groupMaps.forEach(m => { mappedCols.add(m.textCol); mappedCols.add(m.subjectNoCol); mappedCols.add(m.gradeCol); });

  const ignoredColumnsCount = Math.max(0, headers.length - mappedCols.size);

  return {
    sheets,
    data: {
      schools,
      students,
      warnings,
      totalRowsRead,
      parsedAttemptsCount,
      sheetName: targetSheetName,
      headerRowIndex: headerRowIndex + 1, // 1-based for UI
      fixedSubjectMappings: fixedMaps.map(m => `${m.name} + Next Col`),
      groupSubjectMappings: groupMaps.map(m => `${m.name} + Next 2 Cols`),
      ignoredColumnsCount
    }
  };
}
