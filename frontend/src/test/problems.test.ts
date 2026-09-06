import { describe, it, expect } from "vitest";
import { PROBLEMS_DATASET, Problem, getProblemById } from "@/data/problems";

const REQUIRED_LANGUAGES = [
  "python3",
  "python",
  "java",
  "java17",
  "sql",
  "numpy",
  "c",
  "cpp",
  "javascript",
] as const;

describe("PROBLEMS_DATASET integrity and workspace validation", () => {
  it("should have at least 20 comprehensive problems", () => {
    expect(PROBLEMS_DATASET.length).toBeGreaterThanOrEqual(20);
  });

  it("should have unique, non-empty, normalized string IDs for every problem", () => {
    const seenIds = new Set<string>();
    PROBLEMS_DATASET.forEach((p) => {
      expect(typeof p.id).toBe("string");
      expect(p.id.trim()).not.toBe("");
      expect(seenIds.has(p.id)).toBe(false);
      seenIds.add(p.id);
    });
  });

  it("should contain all 10 minimum requested problems and more", () => {
    const ids = PROBLEMS_DATASET.map((p) => p.id);
    const required10 = [
      "two-sum",
      "contains-duplicate",
      "valid-anagram",
      "group-anagrams",
      "top-k-frequent-elements",
      "product-of-array-except-self",
      "valid-palindrome",
      "3sum",
      "container-with-most-water",
      "longest-substring-without-repeating-characters",
    ];

    required10.forEach((reqId) => {
      expect(ids).toContain(reqId);
    });
  });

  it("should have all required workspace fields for every single problem", () => {
    PROBLEMS_DATASET.forEach((p) => {
      expect(p.title, `Problem ${p.id} missing title`).toBeTruthy();
      expect(p.difficulty, `Problem ${p.id} missing difficulty`).toMatch(/^(Easy|Medium|Hard)$/);
      expect(p.category, `Problem ${p.id} missing category`).toBeTruthy();
      expect(p.topic, `Problem ${p.id} missing topic`).toBeTruthy();
      expect(Array.isArray(p.companies), `Problem ${p.id} companies should be array`).toBe(true);
      expect(p.companies.length, `Problem ${p.id} should have at least 1 company`).toBeGreaterThan(0);
      expect(typeof p.description, `Problem ${p.id} description`).toBe("string");
      expect(p.description.trim().length, `Problem ${p.id} description length`).toBeGreaterThan(10);
      expect(Array.isArray(p.examples), `Problem ${p.id} examples should be array`).toBe(true);
      expect(p.examples.length, `Problem ${p.id} should have examples`).toBeGreaterThan(0);
      expect(Array.isArray(p.constraints), `Problem ${p.id} constraints should be array`).toBe(true);
      expect(p.constraints.length, `Problem ${p.id} should have constraints`).toBeGreaterThan(0);
      expect(Array.isArray(p.hints), `Problem ${p.id} hints should be array`).toBe(true);
      expect(p.hints.length, `Problem ${p.id} should have hints`).toBeGreaterThan(0);
      expect(Array.isArray(p.optimalApproach), `Problem ${p.id} optimalApproach should be array`).toBe(true);
      expect(p.optimalApproach.length, `Problem ${p.id} should have optimalApproach`).toBeGreaterThan(0);
      expect(p.timeComplexity, `Problem ${p.id} missing timeComplexity`).toBeTruthy();
      expect(p.spaceComplexity, `Problem ${p.id} missing spaceComplexity`).toBeTruthy();

      // Test cases
      expect(Array.isArray(p.testCases), `Problem ${p.id} testCases should be array`).toBe(true);
      expect(p.testCases.length, `Problem ${p.id} should have at least 1 testCase`).toBeGreaterThan(0);
      p.testCases.forEach((tc, idx) => {
        expect(typeof tc.input, `Problem ${p.id} testCase ${idx} missing input`).toBe("string");
        expect(typeof tc.expectedOutput, `Problem ${p.id} testCase ${idx} missing expectedOutput`).toBe("string");
      });

      // Hidden test cases
      expect(Array.isArray(p.hiddenTestCases), `Problem ${p.id} hiddenTestCases should be array`).toBe(true);

      // Starter codes for all supported languages
      expect(p.starterCodes, `Problem ${p.id} missing starterCodes`).toBeDefined();
      REQUIRED_LANGUAGES.forEach((lang) => {
        expect(
          typeof (p.starterCodes as Record<string, string>)[lang],
          `Problem ${p.id} missing starter code for ${lang}`
        ).toBe("string");
      });
    });
  });

  it("should resolve problem lookup for every problem via getProblemById", () => {
    PROBLEMS_DATASET.forEach((p) => {
      // 1. Exact ID
      const byId = getProblemById(p.id);
      expect(byId?.id).toBe(p.id);

      // 2. Case variations & spacing
      const byUpper = getProblemById(p.id.toUpperCase());
      expect(byUpper?.id).toBe(p.id);

      // 3. By Title
      const byTitle = getProblemById(p.title);
      expect(byTitle?.id).toBe(p.id);
    });
  });

  it("should safely return undefined for non-existent IDs without throwing errors", () => {
    expect(getProblemById("non-existent-problem-id-99999")).toBeUndefined();
    expect(getProblemById("")).toBeUndefined();
    expect(getProblemById(null)).toBeUndefined();
    expect(getProblemById(undefined)).toBeUndefined();
  });
});

