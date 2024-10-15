import Posts, { PostsProps } from "@/components/Posts/Posts";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";

// Mock the Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockedRouter = {
  push: jest.fn(),
};

describe("Posts Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => mockedRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders posts and navigates to the selected post", () => {
    const posts: PostsProps["posts"] = [
      { userId: 1, id: 1, title: "Post 1", body: "This is the body of post 1" },
      { userId: 1, id: 2, title: "Post 2", body: "This is the body of post 2" },
    ];

    render(<Posts posts={posts} />);

    // Check if the posts are rendered
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();

    // Simulate selecting the first post
    fireEvent.click(screen.getByText("Post 1"));

    // Check if the router.push function was called with the correct URL
    expect(mockedRouter.push).toHaveBeenCalledWith("/posts/1");
  });
});
