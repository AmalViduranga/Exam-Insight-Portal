import { describe, it, expect } from 'vitest';
import { parseSubjectNumber, normalizeGrade } from '../lib/subjectParser';

describe('subjectParser', () => {
  describe('parseSubjectNumber', () => {
    it('should extract leading numbers from a string', () => {
      expect(parseSubjectNumber('60')).toBe('60');
      expect(parseSubjectNumber('60SS 3')).toBe('60');
      expect(parseSubjectNumber('86SC 1')).toBe('86');
      expect(parseSubjectNumber('44SA 1')).toBe('44');
      expect(parseSubjectNumber('21 C 2')).toBe('21');
    });

    it('should handle strings without numbers', () => {
      expect(parseSubjectNumber('A')).toBe(null);
      expect(parseSubjectNumber('Math')).toBe(null);
      expect(parseSubjectNumber(' ')).toBe(null);
    });

    it('should handle undefined or null', () => {
      expect(parseSubjectNumber(undefined)).toBe(null);
      expect(parseSubjectNumber(null)).toBe(null);
    });
  });

  describe('normalizeGrade', () => {
    it('should match valid grades exactly', () => {
      expect(normalizeGrade('A')).toBe('A');
      expect(normalizeGrade('B')).toBe('B');
      expect(normalizeGrade('C')).toBe('C');
      expect(normalizeGrade('S')).toBe('S');
      expect(normalizeGrade('W')).toBe('W');
      expect(normalizeGrade('AB')).toBe('AB');
    });

    it('should be case insensitive and trim spaces', () => {
      expect(normalizeGrade(' a ')).toBe('A');
      expect(normalizeGrade(' ab')).toBe('AB');
      expect(normalizeGrade('w ')).toBe('W');
    });

    it('should return null for mixed strings (strict match only)', () => {
      expect(normalizeGrade('21 C 2')).toBe(null);
      expect(normalizeGrade('31 S 2')).toBe(null);
      expect(normalizeGrade('11 A 1')).toBe(null);
    });

    it('should not incorrectly extract grade from inside a subject code', () => {
      // 60SS 3 -> no valid grade, S is part of SS
      expect(normalizeGrade('60SS 3')).toBe(null);
      expect(normalizeGrade('44SA 1')).toBe(null);
      expect(normalizeGrade('86SC 1')).toBe(null);
    });

    it('should return null for invalid grades', () => {
      expect(normalizeGrade('D')).toBe(null);
      expect(normalizeGrade('F')).toBe(null);
      expect(normalizeGrade('123')).toBe(null);
      expect(normalizeGrade('Math')).toBe(null);
    });
  });
});
