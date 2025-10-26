import Link from "next/link";
import { client } from "../libs/client";
// BlogListResponse もインポートする
import type { Blog, BlogListResponse } from "../types/blog";

export default async function Home() {
  // client.getに、新しく作成した BlogListResponse 型を指定する
  const data = await client.get<BlogListResponse>({
    endpoint: "blogs",
  });

  return (
    <div>
      <h1>ブログ一覧</h1>
      <ul>
        {data.contents.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}