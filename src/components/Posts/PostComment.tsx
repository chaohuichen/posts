import { Comment } from "@/types/Post";
import { Stack, Typography } from "@mui/joy";

const PostComment = ({ singleComment }: { singleComment: Comment }) => {
  return (
    <Stack sx={{ my: 3, mx: [0, 5] }}>
      <Stack
        direction={["column", "row"]}
        alignItems={["flex:start", "center"]}
        sx={{ my: 1 }}
      >
        <Typography level="h4" sx={{ fontSize: 14 }}>
          {singleComment?.name}
        </Typography>

        <Typography
          sx={{ ml: [0, 1], fontSize: 12 }}
          color="neutral"
        >{`(${singleComment?.email})`}</Typography>
      </Stack>
      <Typography>{singleComment?.body}</Typography>
    </Stack>
  );
};

export default PostComment;
