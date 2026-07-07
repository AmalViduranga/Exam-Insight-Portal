export function parseSubjectNumber(val: any): string | null {
  if (val == null) return null;
  const str = String(val).trim();
  const match = str.match(/^(\d+)/);
  // Subjects are generally > 0. A "0" from "0 1 5 3" is invalid.
  if (match && match[1] === "0") return null;
  return match ? match[1] : null;
}

export function normalizeGrade(val: any): string | null {
  if (val == null) return null;
  const str = String(val).trim().toUpperCase();
  
  // Strict match: the cell must be exactly the grade
  if (['A', 'B', 'C', 'S', 'W', 'AB'].includes(str)) {
    return str;
  }

  return null;
}
