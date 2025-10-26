import Link from "next/link";
import { client } from "../libs/client";

export default async function Home() {
    const { contents } = await client.get({ endpoint: "blogs" });

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