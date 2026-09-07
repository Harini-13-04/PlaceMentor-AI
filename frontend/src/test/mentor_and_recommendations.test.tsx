import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AIMentor from "@/pages/AIMentor";
import Recommendations from "@/pages/Recommendations";

describe("AIMentor and Recommendations Pages", () => {
  it("renders AIMentor page with title, RAG badge, and domain filters", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AIMentor />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const titleElements = screen.getAllByText(/PlaceMentor AI/i);
    expect(titleElements.length).toBeGreaterThan(0);
    const ragBadges = screen.getAllByText(/RAG Engine/i);
    expect(ragBadges.length).toBeGreaterThan(0);
    expect(screen.getByText(/Grounded RAG Active/i)).toBeDefined();
    expect(screen.getByText(/All Knowledge Domains/i)).toBeDefined();
    expect(screen.getByText(/DSA & Algorithms/i)).toBeDefined();
    expect(screen.getByText(/Company Blueprints/i)).toBeDefined();
  });

  it("renders Recommendations page with title and real performance signals", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Recommendations />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Personalized Daily Recommendations/i)).toBeDefined();
    expect(screen.getByText(/Daily Performance Signals/i)).toBeDefined();
  });
});
