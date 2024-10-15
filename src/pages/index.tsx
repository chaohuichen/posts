import styles from "@/styles/Home.module.css";
import { GetServerSideProps } from "next";
import { Posts } from "@/components/Posts";
import { Post } from "@/types/Post";
import { Box, Typography } from "@mui/joy";

interface HomeProps {
  posts: Post[];
  isGetPostError: boolean;
}

export const getServerSideProps = (async () => {
  // Fetch data from external API
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const resJsonData: Post[] = await res.json();
    return { props: { posts: resJsonData, isGetPostError: false } };
  } catch (err) {
    console.error(err);
    return { props: { posts: [], isGetPostError: true } };
  }
  // Pass data to the page via props
}) satisfies GetServerSideProps<{ posts: Post[]; isGetPostError: boolean }>;

export default function Home({ posts }: HomeProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Box
          sx={{ position: "absolute", top: "30%", alignSelf: "center", display: "block" }}
        >
          <Typography level="h1" sx={{ textAlign: "center" }}>
            adMarketplace Post Assessment
          </Typography>
        </Box>

        <Posts posts={posts} />
      </main>
    </div>
  );
}
