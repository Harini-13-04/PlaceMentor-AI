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
});
