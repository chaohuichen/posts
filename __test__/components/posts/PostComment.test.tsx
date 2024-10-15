import { render, screen } from "@testing-library/react";
import { Comment } from "@/types/Post";
import { PostComment } from "@/components/Posts";

test("renders a single comment with name, email, and body", () => {
  // Mock comment data
  const mockComment: Comment = {
    postId: 1,
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    body: "This is a test comment body",
  };

  // Render the component with the mock data
  render(<PostComment singleComment={mockComment} />);

  // Assertions to check if the component renders the name, email, and body correctly
  const nameElement = screen.getByText("John Doe");
  expect(nameElement).toBeInTheDocument();

  const emailElement = screen.getByText("(john.doe@example.com)");
  expect(emailElement).toBeInTheDocument();

  const bodyElement = screen.getByText("This is a test comment body");
  expect(bodyElement).toBeInTheDocument();
});
