import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import BookCard from "./BookCard.jsx";

const book = {
  _id: "book1",
  title: "React Crash Course",
  author: "Author A",
  price: 499,
  image: "cover.png",
  available: true,
};

describe("BookCard", () => {
  it("shows Pending and disables borrow when request is pending", () => {
    render(
      <BookCard
        book={book}
        onBorrow={vi.fn()}
        myBooks={[]}
        borrowRequests={[{ bookId: "book1", status: "Pending" }]}
      />
    );

    const borrowBtn = screen.getByRole("button", { name: /pending/i });
    expect(borrowBtn).toBeDisabled();
  });

  it("triggers borrow callback when book is available and not requested", () => {
    const onBorrow = vi.fn();
    render(
      <BookCard
        book={book}
        onBorrow={onBorrow}
        myBooks={[]}
        borrowRequests={[]}
      />
    );

    const borrowBtn = screen.getByRole("button", { name: /borrow/i });
    fireEvent.click(borrowBtn);

    expect(onBorrow).toHaveBeenCalledWith(book);
  });
});
