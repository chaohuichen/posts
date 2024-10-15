import { Post } from "@/types/Post";
import { Stack, Typography } from "@mui/joy";

const SinglePostDetail = ({ postDetail }: { postDetail: Post }) => {
  return (
    <Stack alignItems={"center"} sx={{ mb: 0 }}>
      <Typography sx={{ width: ["100%", "80%"], my: 2, textAlign: "center" }} level="h1">
        {postDetail?.title}{" "}
      </Typography>
      <Typography sx={{ width: ["100%", "50%"] }}>{postDetail?.body} </Typography>
    </Stack>
  );
};

export default SinglePostDetail;
