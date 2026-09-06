import { describe, it, expect } from "vitest";
import { executeCodeSubmission, isStarterOrEmpty, compareOutputs, normalizeValue } from "@/utils/codeExecutor";
import { getProblemById, getStarterCode } from "@/data/problems";

describe("codeExecutor Execution & Validation Engine", () => {
  const twoSum = getProblemById("two-sum")!;
  const containsDuplicate = getProblemById("contains-duplicate")!;
  const sqlProblem = getProblemById("combine-two-tables")!;

  it("Test 1: should reject empty or untouched starter code", () => {
    const starter = twoSum.starterCodes.python3;
    expect(isStarterOrEmpty(starter, twoSum, "python3")).toBe(true);

    const runResult = executeCodeSubmission({
      code: starter,
      problem: twoSum,
      language: "python3",
      isSubmit: false,
    });
    expect(runResult.status).toBe("Need Solution");
    expect(runResult.message).toBe("Write your solution before running the test cases.");
    expect(runResult.passedCount).toBe(0);

    const submitResult = executeCodeSubmission({
      code: starter,
      problem: twoSum,
      language: "python3",
      isSubmit: true,
    });
    expect(submitResult.status).toBe("Need Solution");
    expect(submitResult.message).toBe("Write your solution before submitting.");
  });

  it("Test 2: should correctly provide language-specific starter templates without cross-contamination", () => {
    const pyStarter = getStarterCode(twoSum, "python3");
    expect(pyStarter).toContain("def twoSum");
    expect(pyStarter).not.toContain("class Solution {");

    const javaStarter = getStarterCode(twoSum, "java");
    expect(javaStarter).toContain("public int[] twoSum");
    expect(javaStarter).not.toContain("def twoSum");

    const cppStarter = getStarterCode(twoSum, "cpp");
    expect(cppStarter).toContain("vector<int>");
    expect(cppStarter).not.toContain("def twoSum");

    const sqlStarter = getStarterCode(twoSum, "sql");
    expect(sqlStarter).toContain("-- SQL is not supported");
    expect(sqlStarter).not.toContain("def twoSum");

    const realSqlStarter = getStarterCode(sqlProblem, "sql");
    expect(realSqlStarter).toContain("SELECT");
    expect(realSqlStarter).not.toContain("def ");
  });

  it("Test 3: should fail when user only writes pass or whitespace", () => {
    const code = `
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass
`;
    expect(isStarterOrEmpty(code, twoSum, "python3")).toBe(true);
  });

  it("Test 4: should catch syntax errors in JavaScript", () => {
    const code = `
function twoSum(nums, target) {
    if (x > 5
}
`;
    const result = executeCodeSubmission({
      code,
      problem: twoSum,
      language: "javascript",
      isSubmit: false,
    });

    expect(result.status).toBe("Compilation Error");
    expect(result.message).toContain("SyntaxError");
  });

  it("Test 5: should return Wrong Answer for valid code that returns incorrect output", () => {
    const code = `
function twoSum(nums, target) {
    return [0, 0];
}
`;
    const result = executeCodeSubmission({
      code,
      problem: twoSum,
      language: "javascript",
      isSubmit: false,
    });

    expect(result.status).toBe("Wrong Answer");
    expect(result.passedCount).toBe(0);
    expect(result.testCaseResults[0].expected).toBe("[0,1]");
    expect(result.testCaseResults[0].actual).toBe("[0,0]");
  });

  it("Test 6: should pass Accepted for correct Two Sum solution in JavaScript", () => {
    const code = `
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (seen.has(comp)) {
            return [seen.get(comp), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
`;
    const result = executeCodeSubmission({
      code,
      problem: twoSum,
      language: "javascript",
      isSubmit: true,
    });

    expect(result.status).toBe("Accepted");
    expect(result.passedCount).toBe(result.totalCount);
    expect(result.testCaseResults.every((t) => t.passed)).toBe(true);
  });

  it("Test 7: should evaluate Contains Duplicate correctly", () => {
    const wrongCode = `
function containsDuplicate(nums) {
    return false;
}
`;
    const wrongResult = executeCodeSubmission({
      code: wrongCode,
      problem: containsDuplicate,
      language: "javascript",
      isSubmit: false,
    });
    expect(wrongResult.status).toBe("Wrong Answer");

    const correctCode = `
function containsDuplicate(nums) {
    const set = new Set(nums);
    return set.size !== nums.length;
}
`;
    const correctResult = executeCodeSubmission({
      code: correctCode,
      problem: containsDuplicate,
      language: "javascript",
      isSubmit: false,
    });
    expect(correctResult.status).toBe("Accepted");
  });

  it("Test 8: should validate SQL queries correctly", () => {
    const invalidSql = "SELECT *";
    const invalidResult = executeCodeSubmission({
      code: invalidSql,
      problem: sqlProblem,
      language: "sql",
      isSubmit: false,
    });
    expect(invalidResult.status).toBe("Compilation Error");

    const validSql = `
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;
`;
    const validResult = executeCodeSubmission({
      code: validSql,
      problem: sqlProblem,
      language: "sql",
      isSubmit: false,
    });
    expect(validResult.status).toBe("Accepted");
  });

  it("Test 9: should correctly compare order-independent outputs where allowed", () => {
    // Two Sum index order allowance
    expect(compareOutputs([0, 1], "[0,1]", "two-sum")).toBe(true);
    expect(compareOutputs([1, 0], "[0,1]", "two-sum")).toBe(true);
    expect(compareOutputs([0, 0], "[0,1]", "two-sum")).toBe(false);

    // 3Sum array ordering
    expect(compareOutputs([[-1, -1, 2], [-1, 0, 1]], "[[-1,0,1],[-1,-1,2]]", "3sum")).toBe(true);
  });

  it("Test 10: should normalize values safely without losing data", () => {
    expect(normalizeValue(true)).toBe("true");
    expect(normalizeValue(false)).toBe("false");
    expect(normalizeValue(null)).toBe("null");
    expect(normalizeValue(42)).toBe("42");
    expect(normalizeValue([1, 2, 3])).toBe("[1,2,3]");
  });
});
