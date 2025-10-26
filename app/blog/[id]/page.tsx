import { client } from "../../../libs/client";

export default async function BlogId({ params }) {
    const { id } = params;
    const blog = await client.get({ endpoint: "blogs", contentId: id });

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