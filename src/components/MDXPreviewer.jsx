"use client";

import { useState, useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertTriangle, Check, X, Copy, Check as CheckIcon, ExternalLink } from "lucide-react";

const Notice = ({ type = "warning", children }) => {
  const icons = {
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    success: <Check className="w-4 h-4 text-emerald-400" />,
    error: <X className="w-4 h-4 text-rose-400" />,
  };

  const styles = {
    warning: "bg-amber-500/10 border-amber-500 text-amber-200",
    success: "bg-emerald-500/10 border-emerald-500 text-emerald-200",
    error: "bg-rose-500/10 border-rose-500 text-rose-200",
  };

  return (
    <div className={`border-l-4 p-3 my-2 rounded-r-md ${styles[type]} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center gap-2 text-sm">
        {icons[type]}
        <span>{children}</span>
      </div>
    </div>
  );
};

const CodeBlock = ({ className, children }) => {
  const [copied, setCopied] = useState(false);
  const lang = /language-(\w+)/.exec(className || "")?.[1] || "text";
  const code = String(children).trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group my-2">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gray-900/80 rounded-md border border-gray-800 hover:bg-gray-800"
      >
        {copied ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "16px",
          borderRadius: "8px",
          background: "#1a2022",
          border: "1px solid #2d3748",
          fontSize: "14px",
        }}
        wrapLines={true}
        lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const Button = ({ variant = "default", size = "default", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variantClasses = {
    default: "bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-600",
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500",
    destructive: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500",
    outline: "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800 focus:ring-gray-600",
  };
  const sizeClasses = {
    default: "h-10 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, title }) => (
  <div className="my-2 p-4 bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-300 hover:shadow-lg">
    {title && <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>}
    <div className="text-gray-300">{children}</div>
  </div>
);

const customComponents = {
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-semibold text-white mt-4 mb-2 border-b border-gray-700/50 pb-1">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="text-xl md:text-2xl font-medium text-gray-100 mt-3 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-gray-300 my-2 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/50 flex items-center gap-1 transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-6 my-2 text-gray-300 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-2 text-gray-300 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-1 text-sm md:text-base">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500/70 pl-3 my-2 text-gray-400 italic bg-indigo-900/10 py-2 rounded-r-md">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="w-full text-gray-300 border-collapse border border-gray-700">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-800/50">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-gray-800/30 transition-colors">{children}</tr>,
  th: ({ children }) => <th className="px-4 py-2 text-left font-medium border-b border-gray-700">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 border-b border-gray-700">{children}</td>,
  hr: () => <hr className="my-4 border-gray-700/50" />,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto my-3 rounded-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300"
    />
  ),
  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
  Success: ({ children }) => <Notice type="success">{children}</Notice>,
  Warning: ({ children }) => <Notice type="warning">{children}</Notice>,
  Error: ({ children }) => <Notice type="error">{children}</Notice>,
  Button,
  Card,
};

export default function MDXPreviewer({ mdxSource }) {
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

        if (mdxSource.compiledSource) {
          setCompiledContent(<MDXRemote {...mdxSource} components={customComponents} />);
          setError(null);
          return;
        }

        const { content } = await compileMDX({
          source: mdxSource.trim(),
          components: customComponents,
          options: {
            parseFrontmatter: false,
            mdxOptions: {
              remarkPlugins: [remarkParse, remarkMdx, remarkGfm, remarkRehype],
            },
          },
        });

        setCompiledContent(content);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCompiledContent(null);
      }
    };

    const timeoutId = setTimeout(compile, 200);
    return () => clearTimeout(timeoutId);
  }, [mdxSource]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 max-w-full shadow-lg">
      {error ? (
        <Notice type="error">{error}</Notice>
      ) : compiledContent ? (
        compiledContent
      ) : (
        <p className="text-gray-500 italic text-center py-4 animate-pulse">Loading Preview...</p>
      )}
    </div>
  );
}