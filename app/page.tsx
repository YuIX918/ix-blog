import Link from "next/link";
import { client } from "../libs/client";
import type { Blog } from "../types/blog"; // 型をインポート

export default async function Home() {
  // client.getに<...>で型を指定。Blog とすることで配列であることを明示する
  const { contents } = await client.get<{ contents: Blog }>({
    endpoint: "blogs",
  });

  return (
    <div>
      <h1>ブログ一覧</h1>
      <ul>
        {contents.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}