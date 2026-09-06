import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";
import { getProblemById, PROBLEMS_DATASET } from "@/data/problems";
import { CANONICAL_LANGUAGES, getLanguageOptionsForProblem } from "@/config/languages";

// Mock ThemeContext with working toggle
let mockTheme = "dark";
const toggleThemeMock = vi.fn(() => {
  mockTheme = mockTheme === "dark" ? "light" : "dark";
});

vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: vi.fn(),
    toggleTheme: toggleThemeMock,
  }),
}));

// Mock CodeMirror for jsdom
vi.mock("@uiw/react-codemirror", () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div data-testid="codemirror-mock">
      <textarea
        data-testid="codemirror-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

// Mock executeCodeSubmissionAsync
vi.mock("@/utils/codeExecutor", async () => {
  const actual = await vi.importActual<any>("@/utils/codeExecutor");
  return {
    ...actual,
    executeCodeSubmissionAsync: vi.fn(async ({ code, isSubmit, language }) => {
      if (code.includes("return [0, 0]")) {
        return {
          status: "Wrong Answer",
          isSubmit,
          message: "Output did not match expected value",
          runtime: 18,
          memory: 14.8,
          passedCount: 0,
          totalCount: isSubmit ? 7 : 3,
          testCaseResults: [
            {
              input: "nums = [2,7,11,15], target = 9",
              expected: "[0,1]",
              actual: "[0,0]",
              passed: false,
              reason: "Output did not match expected value",
              isHidden: false,
            },
          ],
          consoleOutput: "1 test case failed",
        };
      }
      return {
        status: "Accepted",
        isSubmit,
        message: null,
        runtime: 22,
        memory: 15.2,
        passedCount: isSubmit ? 7 : 3,
        totalCount: isSubmit ? 7 : 3,
        testCaseResults: [
          {
            input: "nums = [2,7,11,15], target = 9",
            expected: "[0,1]",
            actual: "[0,1]",
            passed: true,
            isHidden: false,
          },
        ],
        consoleOutput: "All test cases passed",
      };
    }),
  };
});

describe("Comprehensive Coding Workspace End-to-End Verification", () => {
  const twoSum = getProblemById("two-sum")!;
  const containsDuplicate = getProblemById("contains-duplicate")!;

  it("1. Canonical Language Dropdown: Contains each language EXACTLY ONCE with no duplicates", () => {
    render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);

    const langSelect = screen.getByRole("combobox", { name: /programming language/i }) as HTMLSelectElement;
    expect(langSelect).toBeInTheDocument();

    const options = Array.from(langSelect.options);
    const optionLabels = options.map((opt) => opt.text.trim());
    const optionValues = options.map((opt) => opt.value.trim());

    // Expected exactly 8 languages for standard algorithmic problem
    expect(options.length).toBe(8);

    // Verify exactly one of each
    expect(optionLabels).toEqual([
      "C",
      "C#",
      "C++",
      "Java",
      "JavaScript",
      "TypeScript",
      "Python",
      "Python3",
    ]);

    expect(optionValues).toEqual([
      "c",
      "csharp",
      "cpp",
      "java",
      "javascript",
      "typescript",
      "python",
      "python3",
    ]);

    // Ensure zero duplicates in set
    const uniqueLabels = new Set(optionLabels);
    expect(uniqueLabels.size).toBe(optionLabels.length);

    const uniqueValues = new Set(optionValues);
    expect(uniqueValues.size).toBe(optionValues.length);
  });

  it("2. Code Header: Displays Lock icon with Auto text, Theme toggle, and Fullscreen toggle", () => {
    render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);

    // Lock Auto indicator
    expect(screen.getByText("Auto")).toBeInTheDocument();

    // Theme toggle button
    const themeBtn = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeBtn).toBeInTheDocument();
    fireEvent.click(themeBtn);
    expect(toggleThemeMock).toHaveBeenCalled();

    // Fullscreen toggle button
    const fullscreenBtn = screen.getByTitle(/fullscreen workspace/i);
    expect(fullscreenBtn).toBeInTheDocument();
  });

  it("3. Language Switching & Problem Starter Templates: Updates editor code cleanly for each language", () => {
    render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);

    const langSelect = screen.getByRole("combobox", { name: /programming language/i });
    const textarea = screen.getByTestId("codemirror-textarea") as HTMLTextAreaElement;

    // Python3 (Typed modern Python)
    fireEvent.change(langSelect, { target: { value: "python3" } });
    expect(textarea.value).toContain("class Solution:");
    expect(textarea.value).toContain("def twoSum(self, nums: List[int], target: int) -> List[int]:");

    // Python (Legacy untyped Python)
    fireEvent.change(langSelect, { target: { value: "python" } });
    expect(textarea.value).toContain("class Solution(object):");
    expect(textarea.value).toContain("def twoSum(self, nums, target):");

    // Switch back from Python -> Python3
    fireEvent.change(langSelect, { target: { value: "python3" } });
    expect(textarea.value).toContain("class Solution:");
    expect(textarea.value).toContain("def twoSum(self, nums: List[int], target: int) -> List[int]:");

    // Java
    fireEvent.change(langSelect, { target: { value: "java" } });
    expect(textarea.value).toContain("class Solution {");
    expect(textarea.value).toContain("public int[] twoSum(int[] nums, int target)");

    // C++
    fireEvent.change(langSelect, { target: { value: "cpp" } });
    expect(textarea.value).toContain("class Solution {");
    expect(textarea.value).toContain("vector<int> twoSum(vector<int>& nums, int target)");

    // JavaScript
    fireEvent.change(langSelect, { target: { value: "javascript" } });
    expect(textarea.value).toContain("var twoSum = function(");

    // TypeScript
    fireEvent.change(langSelect, { target: { value: "typescript" } });
    expect(textarea.value).toContain("function twoSum(");
    expect(textarea.value).toContain("): number[]");

    // C#
    fireEvent.change(langSelect, { target: { value: "csharp" } });
    expect(textarea.value).toContain("public class Solution {");
    expect(textarea.value).toContain("public int[] TwoSum(int[] nums, int target)");

    // C
    fireEvent.change(langSelect, { target: { value: "c" } });
    expect(textarea.value).toContain("int* twoSum(");
    expect(textarea.value).toContain("*returnSize");
  });

  it("4. AI Bot: Opens and closes sidebar cleanly, and NO unwanted permanent X beside the main button", () => {
    render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);

    const aiBotBtn = screen.getByRole("button", { name: /ai bot/i });
    expect(aiBotBtn).toBeInTheDocument();

    // Verify there is NO exit (X) button directly in the header beside AI Bot
    expect(screen.queryByTitle("Exit Problem Workspace")).not.toBeInTheDocument();

    // Open AI Bot
    fireEvent.click(aiBotBtn);
    expect(screen.getByText("AI Mentor")).toBeInTheDocument();

    // Close AI Bot via its own sidebar close button
    const closeBtn = screen.getByTitle("Close AI Mentor panel");
    fireEvent.click(closeBtn);
    expect(screen.queryByText("AI Mentor")).not.toBeInTheDocument();
  });

  it("5. Run and Submit: Auto-expands Test Result tab and displays execution output", async () => {
    render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);

    const textarea = screen.getByTestId("codemirror-textarea") as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: {
        value: `class Solution:\n    def twoSum(self, nums, target):\n        return [0, 1]`,
      },
    });

    const runBtn = screen.getByRole("button", { name: /run/i });
    fireEvent.click(runBtn);

    // Test Result tab auto-expands
    await waitFor(() => {
      expect(screen.getByText("Accepted")).toBeInTheDocument();
    });
  });

  it("6. Problem Navigation: Switches problem dynamically without stale templates", () => {
    const { rerender } = render(<PracticeWorkspace problem={twoSum} onBackToList={vi.fn()} />);
    const textarea = screen.getByTestId("codemirror-textarea") as HTMLTextAreaElement;
    expect(textarea.value).toContain("twoSum");

    // Switch to Contains Duplicate
    rerender(<PracticeWorkspace problem={containsDuplicate} onBackToList={vi.fn()} />);
    expect(textarea.value).toContain("containsDuplicate");
    expect(textarea.value).not.toContain("twoSum");
  });
});
