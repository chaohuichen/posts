import { describe } from "node:test";
import HomePage, { getServerSideProps } from "../src/pages/index";
import { render, screen } from "@testing-library/react";
import { Posts } from "@/components/Posts";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
  })),
}));
// Mock the Posts component
jest.mock("@/components/Posts", () => ({
  Posts: jest.fn(() => <div>Mocked Posts Component</div>),
}));

describe("home page", () => {
  it("render the page with", async () => {
    const { container } = render(<HomePage posts={[]} isGetPostError={false} />);

    expect(container).toMatchSnapshot();
  });
  const mockPosts = [
    { id: 1, userId: 1, title: "Post 1", body: "Post 1 body" },
    { id: 2, userId: 1, title: "Post 2", body: "Post 2 body" },
  ];

  it("renders without crashing", () => {
    render(<HomePage posts={mockPosts} isGetPostError={false} />);

    // Check for the main title
    const mainTitle = screen.getByRole("heading", {
      name: /adMarketplace Post Assessment/i,
    });
    expect(mainTitle).toBeInTheDocument();

    // Check if the mocked Posts component is rendered
    expect(screen.getByText("Mocked Posts Component")).toBeInTheDocument();
  });

  it("renders posts correctly", () => {
    render(<HomePage posts={mockPosts} isGetPostError={false} />);

    // Ensure the Posts component receives the correct props
    expect(Posts).toHaveBeenCalledWith({ posts: mockPosts }, {});
  });

  it("handles empty posts gracefully", () => {
    render(<HomePage posts={[]} isGetPostError={false} />);

    // Check for the title, even if there are no posts
    const mainTitle = screen.getByRole("heading", {
      name: /adMarketplace Post Assessment/i,
    });
    expect(mainTitle).toBeInTheDocument();

    // Ensure the Posts component receives an empty array
    expect(Posts).toHaveBeenCalledWith({ posts: [] }, {});
  });

  it("displays an error state when fetching posts fails", async () => {
    const result = await getServerSideProps();

    expect(result).toEqual({
      props: { posts: [], isGetPostError: true },
    });
  });
});
