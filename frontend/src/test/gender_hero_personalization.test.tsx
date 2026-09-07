import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

describe("Gender-Personalized Hero Illustration", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();

    // Mock global fetch for Home dashboard APIs
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/onboarding/status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              onboarding_completed: true,
              profile: {
                academic_year: "3rd Year",
                career_goal: "Software Developer",
                gender: "female",
              },
            }),
        });
      }
      if (url.includes("/api/problems/stats")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              solved_count: 1,
              total_problems: 22,
              attempted_count: 1,
              total_submissions: 1,
              solved_problem_ids: ["two-sum"],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it("renders the female hero illustration with proper alt text when gender is female", async () => {
    localStorage.setItem(
      "placementor_auth_user",
      JSON.stringify({
        id: "u-female-01",
        name: "Harini M",
        email: "harini@srmist.edu.in",
        gender: "female",
      })
    );

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const heroImg = screen.getByAltText("PlaceMentor AI female placement learning illustration");
      expect(heroImg).toBeInTheDocument();
      expect(heroImg.getAttribute("src")).toContain("placement-female");
    });
  });

  it("renders the male hero illustration with proper alt text when gender is male", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/onboarding/status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              onboarding_completed: true,
              profile: {
                academic_year: "3rd Year",
                career_goal: "Software Developer",
                gender: "male",
              },
            }),
        });
      }
      if (url.includes("/api/problems/stats")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              solved_count: 1,
              total_problems: 22,
              attempted_count: 1,
              total_submissions: 1,
              solved_problem_ids: ["two-sum"],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    localStorage.setItem(
      "placementor_auth_user",
      JSON.stringify({
        id: "u-male-02",
        name: "Aditya Kumar",
        email: "aditya@srmist.edu.in",
        gender: "male",
      })
    );

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const heroImg = screen.getByAltText("PlaceMentor AI male placement learning illustration");
      expect(heroImg).toBeInTheDocument();
      expect(heroImg.getAttribute("src")).toContain("placement-male");
    });
  });

  it("renders the neutral hero illustration when gender is missing, unknown, or other", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/onboarding/status")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              onboarding_completed: true,
              profile: {
                academic_year: "3rd Year",
                career_goal: "Software Developer",
                gender: "prefer_not_to_say",
              },
            }),
        });
      }
      if (url.includes("/api/problems/stats")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              solved_count: 1,
              total_problems: 22,
              attempted_count: 1,
              total_submissions: 1,
              solved_problem_ids: ["two-sum"],
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    localStorage.setItem(
      "placementor_auth_user",
      JSON.stringify({
        id: "u-neutral-03",
        name: "Alex",
        email: "alex@srmist.edu.in",
        gender: "",
      })
    );

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const heroImg = screen.getByAltText("PlaceMentor AI placement learning illustration");
      expect(heroImg).toBeInTheDocument();
      expect(heroImg.getAttribute("src")).toContain("placement-neutral");
    });
  });
});
