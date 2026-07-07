import type { ProcessedData, ResultStats} from "./types";

function safePercentage(numerator: number, denominator: number): string {
  if (denominator === 0) return "N/A";
  return ((numerator / denominator) * 100).toFixed(2);
}

export function calculateSchoolSubjectStats(
  data: ProcessedData,
  schoolId: string,
  subjectNumber: string
): ResultStats | null {
  const school = data.schools[schoolId];
  if (!school) return null;

  const students = data.students.filter((s) => s.schoolId === schoolId);

  let totalDid = 0;
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  let sCount = 0;
  let wCount = 0;
  let absentCount = 0;

  for (const student of students) {
    const attempt = student.attempts.find(
      (a) => a.subjectNumber === subjectNumber
    );

    if (attempt) {
      totalDid++;
      switch (attempt.grade) {
        case "A":
          aCount++;
          break;
        case "B":
          bCount++;
          break;
        case "C":
          cCount++;
          break;
        case "S":
          sCount++;
          break;
        case "W":
          wCount++;
          break;
        case "AB":
          absentCount++;
          break;
      }
    }
  }

  const satCount = totalDid - absentCount;
  const passCount = aCount + bCount + cCount + sCount;
  const failCount = wCount; // This matches satCount - passCount if only valid grades are present

  return {
    schoolId: school.id,
    schoolName: school.name,
    subjectNumber,
    totalDid,
    satCount,
    absentCount,
    aCount,
    bCount,
    cCount,
    sCount,
    wCount,
    passCount,
    failCount,
    aPercentage: safePercentage(aCount, satCount),
    bPercentage: safePercentage(bCount, satCount),
    cPercentage: safePercentage(cCount, satCount),
    sPercentage: safePercentage(sCount, satCount),
    wPercentage: safePercentage(wCount, satCount),
    passPercentage: safePercentage(passCount, satCount),
    absentPercentage: safePercentage(absentCount, totalDid),
  };
}

export function calculateAllSchoolsSubjectStats(
  data: ProcessedData,
  subjectNumber: string
): ResultStats[] {
  const results: ResultStats[] = [];
  const schoolIds = Object.keys(data.schools);
  
  for (const schoolId of schoolIds) {
    const stats = calculateSchoolSubjectStats(data, schoolId, subjectNumber);
    if (stats && stats.totalDid > 0) {
      results.push(stats);
    }
  }

  // Sort by school ID or Name (using ID for consistency)
  results.sort((a, b) => a.schoolId.localeCompare(b.schoolId));
  
  return results;
}
