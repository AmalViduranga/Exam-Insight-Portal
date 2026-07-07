import * as XLSX from "xlsx";
import type { ResultStats } from "./types";

export function exportToExcel(data: ResultStats[], filename: string = "All_Schools_Report.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(formatDataForExport(data));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, filename);
}

export function exportToCSV(data: ResultStats[], filename: string = "All_Schools_Report.csv") {
  const worksheet = XLSX.utils.json_to_sheet(formatDataForExport(data));
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatDataForExport(data: ResultStats[]) {
  return data.map((d) => ({
    "School ID": d.schoolId,
    "School Name": d.schoolName,
    "Subject No": d.subjectNumber,
    "Total Did": d.totalDid,
    "Sat Count": d.satCount,
    "Absent Count": d.absentCount,
    "A Count": d.aCount,
    "A %": d.aPercentage,
    "B Count": d.bCount,
    "B %": d.bPercentage,
    "C Count": d.cCount,
    "C %": d.cPercentage,
    "S Count": d.sCount,
    "S %": d.sPercentage,
    "W Count": d.wCount,
    "W %": d.wPercentage,
    "Pass Count": d.passCount,
    "Pass %": d.passPercentage,
    "Absent %": d.absentPercentage,
  }));
}
