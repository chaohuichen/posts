import { render, screen, waitFor } from "@testing-library/react";
import CommentSection from "@/components/Posts/CommentSection";
import userEvent from "@testing-library/user-event";

// Mock the fetch function
global.fetch = jest.fn();

const mockHandleCommentsInput = jest.fn();

describe("CommentSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form inputs and submit button", () => {
    render(<CommentSection handleCommentsInput={mockHandleCommentsInput} />);

    // Check for form fields
    expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type anything…")).toBeInTheDocument();
    expect(screen.getByTestId("submitButton")).toBeInTheDocument();
  });

  it("validates empty form fields and shows error messages", async () => {
    render(<CommentSection handleCommentsInput={mockHandleCommentsInput} />);

    // Click the submit button
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/the name is required./i)).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid email address./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/the comment is required./i)).toBeInTheDocument();
    });
  });

  it("validates incorrect email format", async () => {
    render(<CommentSection handleCommentsInput={mockHandleCommentsInput} />);

    // Fill the form with incorrect email format
    const nameInput = screen.getByPlaceholderText("name");
    const emailInput = screen.getByPlaceholderText("email");
    const commentInput = screen.getByPlaceholderText("Type anything…");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(commentInput, "This is a comment.");

    // Click the submit button
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.click(submitButton);

    // Check for email validation error
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<CommentSection handleCommentsInput={mockHandleCommentsInput} />);

    // Fill the form with valid data
    const nameInput = screen.getByPlaceholderText("name");
    const emailInput = screen.getByPlaceholderText("email");
    const commentInput = screen.getByPlaceholderText("Type anything…");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john.doe@example.com");
    await userEvent.type(commentInput, "This is a valid comment.");
    // Ensure the state is updated before form submission
    await waitFor(() => {
      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john.doe@example.com");
      expect(commentInput).toHaveValue("This is a valid comment.");
    });

    // Click the submit button
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.click(submitButton);

    // // Ensure fetch is called and handleCommentsInput is triggered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/comments",
        expect.any(Object)
      );
      expect(mockHandleCommentsInput).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john.doe@example.com",
        comment: "This is a valid comment.",
      });
    });
  });

  it("handles fetch failure and shows alert", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    // Mock the alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<CommentSection handleCommentsInput={mockHandleCommentsInput} />);

    // Fill the form with valid data
    const nameInput = screen.getByPlaceholderText("name");
    const emailInput = screen.getByPlaceholderText("email");
    const commentInput = screen.getByPlaceholderText("Type anything…");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john.doe@example.com");
    await userEvent.type(commentInput, "This is a valid comment.");

    // Click the submit button
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.click(submitButton);

    // Check if fetch failed and alert is called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(alertMock).toHaveBeenCalledWith(
        "There is something wrong, please try again later"
      );
    });

    // Cleanup mock
    alertMock.mockRestore();
  });
});
