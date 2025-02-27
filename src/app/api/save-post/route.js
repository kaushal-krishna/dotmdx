import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";

export async function POST(request) {
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      development: process.env.NODE_ENV === "development",
    },
    parseFrontmatter: true,
  });

  const slug = "post-" + Date.now().toString().slice(-6);

  console.log("Saved:", { content, slug, frontmatter: mdxSource.frontmatter });

  return NextResponse.json({ slug });
}