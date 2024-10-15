import { PostComment, SinglePostDetail, CommentSection } from "@/components/Posts";
import { CommentFormData } from "@/components/Posts/CommentSection";
import { Comment, Post } from "@/types/Post";
import { Box, Link, Stack, Typography } from "@mui/joy";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const fetchPostDetail = async ({ id }: { id: number }) => {
  try {
    const resPost = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    const resPostJsonData: Post = await resPost.json();
    return { data: resPostJsonData, isError: false };
  } catch (err) {
    console.error(err);
    throw Error("error on fetching post");
  }
};

export const fetchPostComments = async ({ id }: { id: number }) => {
  try {
    const resComments = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${id}`
    );
    const resCommentJsonData: Comment[] = await resComments.json();

    return { data: resCommentJsonData, isError: false };
  } catch (err) {
    throw Error("error on fetching post comments");
  }
};

export const getServerSideProps = (async (context) => {
  const { id } = context.query;
  // Fetch data from external API
  if (!id) {
    return {
      props: {
        isGetPostCommentsError: true,
        isGetPostError: true,
        postDetail: undefined,
        postComments: [],
      },
    };
  }

  try {
    const { data: resPostJsonData, isError: isGetPostError } = await fetchPostDetail({
      id: +id,
    });
    const { data: resCommentJsonData, isError: isGetPostCommentError } =
      await fetchPostComments({ id: +id });

    return {
      props: {
        postDetail: resPostJsonData,
        postComments: resCommentJsonData,
        isGetPostError: isGetPostError,
        isGetPostCommentsError: isGetPostCommentError,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        isGetPostCommentsError: true,
        isGetPostError: true,
        postDetail: undefined,
        postComments: [],
      },
    };
  }
}) satisfies GetServerSideProps<{
  postDetail?: Post;
  postComments?: Comment[];
  isGetPostCommentsError: boolean;
  isGetPostError: boolean;
}>;

interface SinglePostProps {
  postDetail?: Post;
  postComments?: Comment[];
  isGetPostDetailError: boolean;
  isGetPostError: boolean;
}

const SinglePost = ({
  postDetail,
  postComments,
  isGetPostDetailError,
  isGetPostError,
}: SinglePostProps) => {
  const router = useRouter();
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  if (
    isGetPostError ||
    isGetPostDetailError ||
    !postDetail ||
    (postComments && postComments?.length <= 0)
  ) {
    return (
      <Stack
        component={"main"}
        className="mainContent"
        sx={{
          height: "100dvh",
          px: ["2%", "5%"],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography level="h1" sx={{ textAlign: "center", my: 2 }}>
          Invalid post Id : {router?.query?.id}
        </Typography>
        <Link href="/">
          <Typography sx={{ textDecoration: "underline" }}>Go To Home</Typography>
        </Link>
      </Stack>
    );
  }
  // if the comments data is not empty, store in the local
  useEffect(() => {
    if (postComments?.length) {
      setLocalComments(postComments);
    }
  }, [postComments?.length]);

  const handleCommentsInput = useCallback(
    (inputComment: CommentFormData) => {
      const lastComment = localComments[localComments?.length - 1];
      const commentId = lastComment
        ? localComments[localComments?.length - 1]?.id + 1
        : 1;
      const transformCommentFormData = {
        id: commentId,
        postId: lastComment?.postId ?? 1,
        ...inputComment,
        body: inputComment.comment,
      } as Comment;
      const tempComments = [...localComments];
      tempComments.push(transformCommentFormData);

      setLocalComments(tempComments);
    },
    [setLocalComments, localComments]
  );

  return (
    <Stack
      component={"main"}
      className="mainContent"
      sx={{
        height: "100dvh",
        px: ["2%", "5%"],
        justifyContent: "space-between",
      }}
    >
      {postDetail && <SinglePostDetail postDetail={postDetail} />}
      <Box>
        {localComments?.map((singlePostComment) => {
          return (
            <PostComment key={singlePostComment.id} singleComment={singlePostComment} />
          );
        })}
      </Box>
      <Box sx={{ minHeight: 50 }}>
        <CommentSection handleCommentsInput={handleCommentsInput} />
      </Box>
    </Stack>
  );
};

export default SinglePost;
