import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import SinglePost from "@/pages/posts/[id]";
import {
  fetchPostDetail,
  fetchPostComments,
  getServerSideProps,
} from "@/pages/posts/[id]";
import { GetServerSidePropsContext } from "next";
// Mock components that are imported in SinglePost
jest.mock("@/components/Posts", () => ({
  PostComment: jest.fn(({ singleComment }) => <div>{singleComment.body}</div>),
  SinglePostDetail: jest.fn(({ postDetail }) => <div>{postDetail.title}</div>),
  CommentSection: jest.fn(({ handleCommentsInput }) => (
    <button onClick={() => handleCommentsInput({ comment: "New comment" })}>
      Add Comment
    </button>
  )),
}));

// Mock the router for navigation in tests
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SinglePost Component", () => {
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      query: { id: "1" },
    });
  });

  it("renders post detail correctly", () => {
    const mockPostDetail = { id: 1, userId: 1, title: "Post Title", body: "Post Body" };
    const mockPostComments = [
      { id: 1, postId: 1, name: "test1", email: "test1@test.com", body: "Comment 1" },
      { id: 2, postId: 1, name: "test2", email: "test2@test.com", body: "Comment 2" },
    ];

    render(
      <SinglePost
        postDetail={mockPostDetail}
        postComments={mockPostComments}
        isGetPostDetailError={false}
        isGetPostError={false}
      />
    );

    // Check if post detail is rendered
    expect(screen.getByText("Post Title")).toBeInTheDocument();

    // Check if comments are rendered
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 2")).toBeInTheDocument();
  });

  it("displays an error when the post or comments are not found", () => {
    render(
      <SinglePost
        postDetail={undefined}
        postComments={[]}
        isGetPostDetailError={true}
        isGetPostError={true}
      />
    );

    // Check for error message
    expect(screen.getByText("Invalid post Id : 1")).toBeInTheDocument();
    expect(screen.getByText("Go To Home")).toBeInTheDocument();
  });

  it("handles new comment input correctly", () => {
    const mockPostDetail = { id: 1, userId: 1, title: "Post Title", body: "Post Body" };
    const mockPostComments = [
      { id: 1, postId: 1, name: "test", email: "test@test.com", body: "Comment 1" },
    ];

    render(
      <SinglePost
        postDetail={mockPostDetail}
        postComments={mockPostComments}
        isGetPostDetailError={false}
        isGetPostError={false}
      />
    );

    // Simulate adding a new comment
    const addCommentButton = screen.getByText("Add Comment");
    fireEvent.click(addCommentButton);

    // Check if the new comment is added
    expect(screen.getByText("New comment")).toBeInTheDocument();
  });
});

// / Mock global fetch
global.fetch = jest.fn();

describe("fetchPostDetail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches post details successfully", async () => {
    const mockPostData = { id: 1, title: "Post Title", body: "Post Body" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockPostData),
    });

    const result = await fetchPostDetail({ id: 1 });

    expect(fetch).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/posts/1");
    expect(result).toEqual({ data: mockPostData, isError: false });
  });

  it("handles fetch error correctly", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchPostDetail({ id: 1 })).rejects.toThrow("error on fetching post");
  });
});

describe("fetchPostComments", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches post comments successfully", async () => {
    const mockCommentsData = [
      { id: 1, postId: 1, body: "Comment 1" },
      { id: 2, postId: 1, body: "Comment 2" },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockCommentsData),
    });

    const result = await fetchPostComments({ id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/comments?postId=1"
    );
    expect(result).toEqual({ data: mockCommentsData, isError: false });
  });

  it("handles fetch error correctly", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchPostComments({ id: 1 })).rejects.toThrow(
      "error on fetching post comments"
    );
  });
});

describe("getServerSideProps", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns props with post detail and comments on success", async () => {
    const mockPostData = { id: 1, title: "Post Title", body: "Post Body" };
    const mockCommentsData = [
      { id: 1, postId: 1, body: "Comment 1" },
      { id: 2, postId: 1, body: "Comment 2" },
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockPostData),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockCommentsData),
      });

    const context = { query: { id: "1" } } as unknown as GetServerSidePropsContext;

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        postDetail: mockPostData,
        postComments: mockCommentsData,
        isGetPostError: false,
        isGetPostCommentsError: false,
      },
    });
  });

  it("returns error props when post or comments fetch fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const context = { query: { id: "1" } } as unknown as GetServerSidePropsContext;

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        isGetPostCommentsError: true,
        isGetPostError: true,
        postDetail: undefined,
        postComments: [],
      },
    });
  });

  it("returns error props when id is missing", async () => {
    const context = { query: {} } as unknown as GetServerSidePropsContext;

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        isGetPostCommentsError: true,
        isGetPostError: true,
        postDetail: undefined,
        postComments: [],
      },
    });
  });
});
