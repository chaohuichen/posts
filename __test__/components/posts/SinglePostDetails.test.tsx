import { render, screen } from "@testing-library/react";
import { Post } from "@/types/Post";
import { SinglePostDetail } from "@/components/Posts";

describe("SinglePostDetail Component", () => {
  it("renders post details correctly", () => {
    const mockPost: Post = {
      userId: 1,
      id: 1,
      title: "Test Post Title",
      body: "This is the body of the test post.",
    };

    render(<SinglePostDetail postDetail={mockPost} />);

    // Check if the title and body are rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Post Title"
    );
    expect(screen.getByText("This is the body of the test post.")).toBeInTheDocument();
  });
});
