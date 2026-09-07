import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Recommendations from "@/pages/Recommendations";

describe("Recommendations Page", () => {

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
