import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header.jsx";

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("navigates member to view-all-books on search focus", () => {
    localStorage.setItem("role", "member");
    const handleNavigation = vi.fn();

    render(
      <Header
        unreadCount={0}
        setShowNotifications={vi.fn()}
        handleNavigation={handleNavigation}
        logo="logo.png"
        searchQuery=""
        setSearchQuery={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/search books/i);
    fireEvent.focus(input);

    expect(handleNavigation).toHaveBeenCalledWith("/view-all-books");
  });

  it("navigates admin to crud-book on first search input", () => {
    localStorage.setItem("role", "admin");
    const handleNavigation = vi.fn();
    const setSearchQuery = vi.fn();

    render(
      <Header
        unreadCount={0}
        setShowNotifications={vi.fn()}
        handleNavigation={handleNavigation}
        logo="logo.png"
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const input = screen.getByPlaceholderText(/search books/i);
    fireEvent.change(input, { target: { value: "react" } });

    expect(handleNavigation).toHaveBeenCalledWith("/crud-book");
    expect(setSearchQuery).toHaveBeenCalledWith("react");
  });
});
