import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";
import { getProblemById } from "@/data/problems";

// Mock ThemeContext
vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark", toggleTheme: vi.fn() }),
}));

// Mock CodeMirror to avoid DOM measurements in jsdom
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

// Mock executeCodeSubmissionAsync for isolated component testing
vi.mock("@/utils/codeExecutor", async () => {
  const actual = await vi.importActual<any>("@/utils/codeExecutor");
  return {
    ...actual,
    executeCodeSubmissionAsync: vi.fn(async ({ code, isSubmit }) => {
      if (code.includes("return [0, 0]")) {
        return {
          status: "Wrong Answer",
          isSubmit,
          message: null,
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

describe("PracticeWorkspace UI Component", () => {
  const problem = getProblemById("two-sum")!;

  it("renders workspace header with title, difficulty badge, run, submit, and AI Bot buttons", () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    // Problem title in header & heading
    expect(screen.getAllByText("Two Sum").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Easy").length).toBeGreaterThanOrEqual(1);

    // Run & Submit buttons
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();

    // AI Bot button
    expect(screen.getByRole("button", { name: /ai bot/i })).toBeInTheDocument();

    // Code editor top-right has ONLY fullscreen button (no Reset or Format buttons)
    expect(screen.getByTitle(/fullscreen/i)).toBeInTheDocument();
    expect(screen.queryByText("Reset")).not.toBeInTheDocument();
  });

  it("opens AI Mentor sidebar when AI Bot button is clicked and closes it when X is clicked", () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    // AI Mentor sidebar initially not open (0 width/unmounted)
    expect(screen.queryByText("AI Mentor")).not.toBeInTheDocument();

    // Click AI Bot button in header
    const aiBotBtn = screen.getByRole("button", { name: /ai bot/i });
    fireEvent.click(aiBotBtn);

    // AI Mentor sidebar is now visible
    expect(screen.getByText("AI Mentor")).toBeInTheDocument();
    expect(screen.getByTitle("Close AI Mentor panel")).toBeInTheDocument();

    // Click Close (X) button
    const closeBtn = screen.getByTitle("Close AI Mentor panel");
    fireEvent.click(closeBtn);

    // AI Mentor sidebar is completely closed and unmounted (no empty container)
    expect(screen.queryByText("AI Mentor")).not.toBeInTheDocument();
  });

  it("toggles Fullscreen mode when Fullscreen button in code editor is clicked", () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    // Problem Description is visible initially
    expect(screen.getByRole("complementary", { name: /problem description/i })).toBeInTheDocument();

    // Click Fullscreen button in Code Editor header
    const fullscreenBtn = screen.getByTitle(/fullscreen workspace/i);
    fireEvent.click(fullscreenBtn);

    // Problem description panel is collapsed for fullscreen focus mode
    expect(screen.queryByRole("complementary", { name: /problem description/i })).not.toBeInTheDocument();

    // Click Exit Fullscreen
    const exitFullscreenBtn = screen.getByTitle(/exit fullscreen/i);
    fireEvent.click(exitFullscreenBtn);

    // Problem description is restored
    expect(screen.getByRole("complementary", { name: /problem description/i })).toBeInTheDocument();
  });

  it("allows switching programming language in selector", () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    const select = screen.getByLabelText("Programming Language") as HTMLSelectElement;
    expect(select.value).toBe("python3");

    fireEvent.change(select, { target: { value: "java" } });
    expect(select.value).toBe("java");
  });

  it("automatically expands the bottom console and switches to Test Result tab when Run is clicked", async () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    // Initially on Testcases tab
    expect(screen.getByText("Input Parameters")).toBeInTheDocument();

    // Collapse the console manually
    const collapseBtn = screen.getByTitle("Collapse Console");
    fireEvent.click(collapseBtn);

    // Once collapsed, the content inside is hidden
    expect(screen.queryByText("Input Parameters")).not.toBeInTheDocument();

    // Enter solution code
    const textarea = screen.getByTestId("codemirror-textarea") as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: {
        value: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        return [0, 0]`,
      },
    });

    // Click Run
    const runBtn = screen.getByRole("button", { name: /run/i });
    fireEvent.click(runBtn);

    // The console must automatically expand and switch to Test Result tab showing results
    const wrongAnswer = await screen.findByText("Wrong Answer");
    expect(wrongAnswer).toBeInTheDocument();
    expect(screen.getByText("Your Output:")).toBeInTheDocument();
  });

  it("automatically expands the bottom console and switches to Test Result tab when Submit is clicked", async () => {
    render(
      <PracticeWorkspace
        problem={problem}
        onBackToList={vi.fn()}
      />
    );

    // Collapse console first
    const collapseBtn = screen.getByTitle("Collapse Console");
    fireEvent.click(collapseBtn);

    // Enter correct code
    const textarea = screen.getByTestId("codemirror-textarea") as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: {
        value: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []`,
      },
    });

    // Click Submit
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    // The console must automatically expand and display Accepted result immediately
    const accepted = await screen.findByText("Accepted");
    expect(accepted).toBeInTheDocument();
  });
});
