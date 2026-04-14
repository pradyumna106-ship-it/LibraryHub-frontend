import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Header from './Header';
import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test('navigates member to view-all-books on search focus', () => {
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

  fireEvent.focus(screen.getByPlaceholderText(/search books/i))[0];

  expect(handleNavigation).toHaveBeenCalledTimes(1);
  expect(handleNavigation).toHaveBeenCalledWith('/view-all-books');
});


test('navigates admin to crud-book on first input', () => {
  localStorage.setItem("role", "admin");

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

  const input = screen.getByTestId("search-input");

  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'book' } });

  expect(handleNavigation).toHaveBeenCalledWith('/crud-book');
});