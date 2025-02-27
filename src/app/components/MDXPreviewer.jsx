"use client";

import { useState, useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Warning = () => (
  <div className="my-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-md text-yellow-100">
    <span className="font-semibold">Warning:</span> This is a custom warning
    component!
  </div>
);

const customComponents = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "text";
    const cleanedCode = String(children)
      .split("\n")
      .map((line) => line.replace(/\s+$/, "").replace(/^\s+/, ""))
      .filter((line) => line.length > 0)
      .join("\n");
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        PreTag="div"
        customStyle={{
          margin: "0",
          padding: "1rem",
          borderRadius: "0.5rem",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
        }}
        wrapLines={true}
        {...props}
      >
        {cleanedCode}
      </SyntaxHighlighter>
    );
  },
  h1: ({ children }) => (
    <h1 className="text-3xl font-semibold text-indigo-300">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-medium text-purple-300">{children}</h2>
  ),
  p: ({ children }) => <p className="text-gray-200 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-gray-200">{children}</ul>
  ),
  Warning,
  Button: ({ variant, children }) => (
    <button
      className={`px-4 py-2 ${
        variant === "primary" ? "bg-blue-500" : "bg-gray-500"
      } text-white rounded`}
    >
      {children}
    </button>
  ),
};

export default function MDXPreviewer({ mdxSource, isEditor = false }) {
  const [compiledContent, setCompiledContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const compile = async () => {
      try {
        if (!mdxSource) {
          setCompiledContent(null);
          setError(null);
          return;
        }

        // If precompiled MDX is provided (not editor mode)
        if (!isEditor && mdxSource.compiledSource) {
          setCompiledContent(<MDXRemote {...mdxSource} components={customComponents} />);
          setError(null);
          return;
        }

        // Dynamic compilation for editor mode or raw MDX source
        const { content } = await compileMDX({
          source: mdxSource.trim(),
          components: customComponents,
          options: {
            parseFrontmatter: true,
            mdxOptions: {
              remarkPlugins: [remarkParse, remarkMdx, remarkRehype],
              rehypePlugins: [],
            },
          },
        });
        setCompiledContent(content);
        setError(null);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(
          err instanceof Error ? err : new Error("MDX compilation failed")
        );
        setCompiledContent(null);
      }
    };
    compile();
  }, [mdxSource, isEditor]);

  // Render logic
  const hasCompiledSource = mdxSource?.compiledSource && !isEditor;
  const frontmatter = hasCompiledSource ? mdxSource.frontmatter : null;

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-700/50 ${
        isEditor ? "h-full" : ""
      }`}
    >
      {isEditor && (
        <div className="bg-gray-800/70 px-4 py-2 border-b border-gray-700/50">
          <h2 className="text-sm font-medium text-indigo-400 tracking-wide">
            Preview
          </h2>
        </div>
      )}

      <article
        className={`flex-1 ${
          isEditor
            ? "bg-gray-900 p-4 overflow-auto"
            : "bg-gray-900/80 backdrop-blur-md p-6"
        } prose prose-invert prose-indigo max-w-none`}
      >
        {frontmatter && !isEditor && (
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              {frontmatter.title}
            </h1>
            <div className="mt-2 text-sm text-gray-400">
              <span>{new Date(frontmatter.date).toLocaleDateString()}</span> •{" "}
              <span>{frontmatter.author}</span>
            </div>
          </header>
        )}

        {error ? (
          <div className="text-red-400 text-sm">Error: {error.message}</div>
        ) : compiledContent ? (
          compiledContent
        ) : isEditor ? (
          <p className="text-gray-500 italic">Start typing to see the preview...</p>
        ) : (
          <p className="text-red-400 text-sm">Error: Invalid MDX content provided.</p>
        )}
      </article>
    </div>
  );
}