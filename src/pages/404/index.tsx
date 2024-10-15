import { Stack, Typography } from "@mui/joy";
import Link from "next/link";

const Custom404 = () => {
  return (
    <Stack
      sx={{
        height: "100dvh",
        px: ["2%", "5%"],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography level="h1">404: Page Not Found</Typography>
      <Link href="/">
        <Typography sx={{ textDecoration: "underline" }}>Go To Home</Typography>
      </Link>
    </Stack>
  );
};

export default Custom404;
