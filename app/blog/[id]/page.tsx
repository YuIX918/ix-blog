import { client } from "../../../libs/client";
import type { Blog } from "../../../types/blog"; // 型をインポート

// paramsに型を指定
export default async function BlogId({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  // client.getに<...>で型を指定
  const blog = await client.get<Blog>({ endpoint: "blogs", contentId: id });

  return (
    <main>
      <h1>{blog.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
      />
    </main>
  );
}