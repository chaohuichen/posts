import { Post } from "@/types/Post";
import { Select, Option } from "@mui/joy";
import { useRouter } from "next/router";

export interface PostsProps {
  posts: Post[];
}

const Posts = ({ posts }: PostsProps) => {
  const router = useRouter();

  return (
    <Select
      placeholder="Select a Post"
      sx={{ width: ["70vw", "50vw"], flex: 1 }}
      slotProps={{
        listbox: { placement: "bottom-start", sx: { minWidth: [250, 400] } },
      }}
    >
      {posts?.map((singlePost) => {
        return (
          <Option
            value={singlePost?.id}
            key={singlePost?.id}
            sx={{
              whiteSpace: "normal", // Allows wrapping
              wordBreak: "break-word", // Breaks long words
            }}
            onClick={() => router.push(`/posts/${singlePost.id}`)}
          >
            {singlePost.title}
          </Option>
        );
      })}
    </Select>
  );
};

export default Posts;
