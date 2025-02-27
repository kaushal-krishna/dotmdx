import { serialize } from "next-mdx-remote/serialize";
import MDXPreviewer from "@/components/MDXPreviewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const samplePost = `
    ---
    title: DotMDX: The Future of Dynamic Content
    description: Unleash creativity with MDX—where Markdown meets React.
    date: 2025-02-26
    author: Kaushal Krishna
    tags: [mdx, react, nextjs, devtools]
    image: https://via.placeholder.com/1200x600
    ---
  `;
  const mdxSource = await serialize(samplePost, { parseFrontmatter: true });

  return {
    title: mdxSource.frontmatter?.title || `Post: ${slug}`,
    description:
      mdxSource.frontmatter?.description || "A DotMDX post powered by mdxjs.",
  };
}

export default async function Post({ params }) {
  const { slug } = params;

  const samplePost = `
# DotMDX: The Future of Dynamic Content 🚀

![Cover](https://avatars.githubusercontent.com/u/37453691?s=100&v=4)

MDX is here to redefine how we create content—combining **Markdown’s simplicity** with **React’s power**. It’s not just for devs; it’s for anyone who wants to craft engaging, interactive stories.

## Why Choose MDX?

<Card title="Supercharge Your Content">
- ✍️ **Markdown + React**: Write naturally, add components effortlessly.  
- ⚡ **Interactive Vibes**: Live code, buttons, and more.  
- 🌐 **Web-Ready**: Perfect for modern frameworks like Next.js.
</Card>

## Killer Use Cases

1. **Dev Blogs**  
   Drop some live code:  
   \`\`\`jsx
   const Welcome = ({ user }) => <h2>Welcome, {user}!</h2>;
   \`\`\`

2. **Tutorials**  
   Add clickable demos:  
   <Button variant="primary" size="sm">Run Demo</Button>

3. **Creative Posts**  
   Engage with dynamic elements.

   <br/>

<Success>Like this post? Hit the heart below!</Success>
  `;

  try {
    const mdxSource = await serialize(samplePost, {
      mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
      parseFrontmatter: true,
    });

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        {/* Header */}
        <header className="bg-gray-900/95 py-4 px-6 border-b border-gray-800 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{mdxSource.frontmatter?.author || "Kaushal Krishna"}</span>
              <span className="text-gray-600">•</span>
              <span>
                {new Date(
                  mdxSource.frontmatter?.date || Date.now()
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-8 px-6">
          {/* Cover Image */}
          {mdxSource.frontmatter?.image && (
            <div className="mb-8">
              <img
                src={mdxSource.frontmatter.image}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg border border-gray-800 shadow-md"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {mdxSource.frontmatter?.title || "Untitled Post"}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {mdxSource.frontmatter?.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>5 min read</span>
              <span className="text-gray-600">•</span>
              <span>{Math.floor(Math.random() * 50) + 1} likes</span>
            </div>
          </div>

          {/* MDX Content */}
          <MDXPreviewer mdxSource={mdxSource} />

          {/* Social Actions */}
          <div className="mt-8 flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex gap-6">
              <button className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              <span>{Math.floor(Math.random() * 20)} comments</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900/95 py-6 px-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-lg font-medium">
                {mdxSource.frontmatter?.author?.charAt(0) || "K"}
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  {mdxSource.frontmatter?.author || "Kaushal Krishna"}
                </p>
                <p className="text-xs text-gray-500">
                  Dev & Creator •{" "}
                  <a
                    href="https://x.com/kaushalkrishnax"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    @kaushalkrishnax
                  </a>
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Built with{" "}
              <code className="text-indigo-400 font-mono">mdxjs</code> • ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Failed to serialize MDX:", error);
    notFound();
  }
}
