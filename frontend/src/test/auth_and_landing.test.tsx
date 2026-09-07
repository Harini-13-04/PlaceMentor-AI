import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

describe("PlaceMentor AI Prototype — Landing & Auth Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders Landing page hero headline, CTAs, and doodle artwork", () => {
    renderWithProviders(<Landing />);

    expect(screen.getByText(/Prepare Today/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Get Placed/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Get Started Free/i)).toBeInTheDocument();

    // Check doodle illustration image
    expect(screen.getAllByAltText(/PlaceMentor AI Hero Illustration/i).length).toBeGreaterThan(0);
  });

  it("renders Login page with doodle artwork, email input, and submit button", () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument();
    expect(screen.getByText(/Log in to continue/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getAllByAltText(/PlaceMentor AI Login Illustration/i).length).toBeGreaterThan(0);
  });

  it("renders Register page with doodle artwork and registration fields", () => {
    renderWithProviders(<Register />);

    expect(screen.getByText(/Create Your Journey!/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up to get started/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getAllByAltText(/PlaceMentor AI Register Illustration/i).length).toBeGreaterThan(0);
  });
});
