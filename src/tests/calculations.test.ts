import { describe, it, expect } from 'vitest';
import { calculateSchoolSubjectStats, calculateAllSchoolsSubjectStats } from '../lib/calculations';
import type { ProcessedData, StudentRow} from "../lib/types";

// Mock small dataset
const mockStudents: StudentRow[] = [
  {
    rowNumber: 1,
    schoolId: 'S001',
    schoolName: 'Test School A',
    attempts: [
      { subjectNumber: '60', grade: 'A', sourceColumn: '1st Subject Group' },
      { subjectNumber: '63', grade: 'W', sourceColumn: '2nd Subject Group' },
    ]
  },
  {
    rowNumber: 2,
    schoolId: 'S001',
    schoolName: 'Test School A',
    attempts: [
      { subjectNumber: '60', grade: 'B', sourceColumn: '1st Subject Group' },
      { subjectNumber: '63', grade: 'AB', sourceColumn: '2nd Subject Group' },
    ]
  },
  {
    rowNumber: 3,
    schoolId: 'S001',
    schoolName: 'Test School A',
    attempts: [
      { subjectNumber: '60', grade: 'AB', sourceColumn: '1st Subject Group' },
    ]
  },
  {
    rowNumber: 4,
    schoolId: 'S002',
    schoolName: 'Test School B',
    attempts: [
      { subjectNumber: '60', grade: 'C', sourceColumn: '1st Subject Group' },
    ]
  }
];

const mockData: ProcessedData = {
  schools: {
    'S001': { id: 'S001', name: 'Test School A' },
    'S002': { id: 'S002', name: 'Test School B' }
  },
  students: mockStudents,
  warnings: [],
  totalRowsRead: 4,
  parsedAttemptsCount: 6,
  sheetName: "Sheet1",
  headerRowIndex: 1,
  fixedSubjectMappings: [],
  groupSubjectMappings: [],
  ignoredColumnsCount: 0
};

describe('calculations', () => {
  describe('calculateSchoolSubjectStats', () => {
    it('should correctly calculate counts and percentages for a subject', () => {
      const stats = calculateSchoolSubjectStats(mockData, 'S001', '60');
      
      expect(stats).not.toBeNull();
      if (!stats) return;

      expect(stats.totalDid).toBe(3);
      expect(stats.absentCount).toBe(1);
      expect(stats.satCount).toBe(2);
      expect(stats.aCount).toBe(1);
      expect(stats.bCount).toBe(1);
      expect(stats.cCount).toBe(0);
      expect(stats.sCount).toBe(0);
      expect(stats.wCount).toBe(0);
      expect(stats.passCount).toBe(2);
      expect(stats.failCount).toBe(0);

      // Percentages
      expect(stats.aPercentage).toBe('50.00');
      expect(stats.passPercentage).toBe('100.00');
      expect(stats.absentPercentage).toBe('33.33');
    });

    it('should safely handle zero denominators', () => {
      const stats = calculateSchoolSubjectStats(mockData, 'S001', '63');
      expect(stats?.passPercentage).toBe('0.00'); // 0 / 1
      expect(stats?.wPercentage).toBe('100.00'); // 1 / 1
      
      const emptySatData: ProcessedData = {
        ...mockData,
        students: [
          { rowNumber: 1, schoolId: 'S001', schoolName: 'Test School A', attempts: [{ subjectNumber: '60', grade: 'AB', sourceColumn: '1st Subject Group' }] }
        ]
      };
      
      const emptyStats = calculateSchoolSubjectStats(emptySatData, 'S001', '60');
      expect(emptyStats?.satCount).toBe(0);
      expect(emptyStats?.passPercentage).toBe('N/A'); // 0 denominator
      expect(emptyStats?.aPercentage).toBe('N/A'); // 0 denominator
      expect(emptyStats?.absentPercentage).toBe('100.00'); // totalDid is 1, so 1/1
    });

    it('should handle zero totalDid', () => {
      const stats = calculateSchoolSubjectStats(mockData, 'S001', '99'); // non-existent subject
      expect(stats?.totalDid).toBe(0);
      expect(stats?.absentPercentage).toBe('N/A');
      expect(stats?.passPercentage).toBe('N/A');
    });

    it('should calculate exact percentages for comprehensive selected-subject requirement', () => {
      const comprehensiveStudents: StudentRow[] = [
        { rowNumber: 1, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'A', sourceColumn: 'Religion' }] },
        { rowNumber: 2, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'B', sourceColumn: 'Religion' }] },
        { rowNumber: 3, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'C', sourceColumn: 'Religion' }] },
        { rowNumber: 4, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'S', sourceColumn: 'Religion' }] },
        { rowNumber: 5, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'W', sourceColumn: 'Religion' }] },
        { rowNumber: 6, schoolId: 'S003', schoolName: 'Test School C', attempts: [{ subjectNumber: '60', grade: 'AB', sourceColumn: 'Religion' }] },
      ];

      const compData: ProcessedData = {
        ...mockData,
        schools: { 'S003': { id: 'S003', name: 'Test School C' } },
        students: comprehensiveStudents,
      };

      const stats = calculateSchoolSubjectStats(compData, 'S003', '60');
      expect(stats).not.toBeNull();
      if (!stats) return;

      expect(stats.totalDid).toBe(6);
      expect(stats.absentCount).toBe(1);
      expect(stats.satCount).toBe(5);
      expect(stats.aCount).toBe(1);
      expect(stats.bCount).toBe(1);
      expect(stats.cCount).toBe(1);
      expect(stats.sCount).toBe(1);
      expect(stats.wCount).toBe(1);
      expect(stats.passCount).toBe(4);
      expect(stats.failCount).toBe(1);
      
      expect(stats.passPercentage).toBe('80.00');
      expect(stats.aPercentage).toBe('20.00');
      expect(stats.bPercentage).toBe('20.00');
      expect(stats.cPercentage).toBe('20.00');
      expect(stats.sPercentage).toBe('20.00');
      expect(stats.wPercentage).toBe('20.00');
      expect(stats.absentPercentage).toBe('16.67');
    });
  });

  describe('calculateAllSchoolsSubjectStats', () => {
    it('should aggregate stats for all schools correctly', () => {
      const allStats = calculateAllSchoolsSubjectStats(mockData, '60');
      expect(allStats.length).toBe(2);
      expect(allStats[0].schoolId).toBe('S001'); // 3 total did
      expect(allStats[1].schoolId).toBe('S002'); // 1 total did
    });

    it('should exclude schools with 0 attempts for the subject', () => {
      const allStats = calculateAllSchoolsSubjectStats(mockData, '63');
      expect(allStats.length).toBe(1); // Only S001 has subject 63
      expect(allStats[0].schoolId).toBe('S001');
    });
  });
});
