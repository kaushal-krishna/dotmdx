"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Save,
  UploadCloud,
  Bold,
  Italic,
  Undo2,
  Redo2,
  Heading,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  FileCode,
  EyeOff,
  Eye,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import MDXPreviewer from "@/components/MDXPreviewer";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";

const initialContent = `
# Welcome to DotMDX Editor
This is a **live MDX editor** with real-time preview!
## Features
- Syntax highlighting
- Live preview
- MDX component support:
<Button variant="primary">Click me</Button>
`;

export default function EditorPage() {
  const [mdxSource, setMdxSource] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(16);
  const editorRef = useRef(null);

  useEffect(() => {
    // Try to load saved content from localStorage
    try {
      const savedContent = localStorage.getItem("mdxDraft");
      if (savedContent) {
        setMdxSource(savedContent);
      }
    } catch (err) {
      console.error("Error loading saved content:", err);
    }

    if (editorRef.current) {
      const editor = editorRef.current.editor;

      // Add custom commands
      editor.commands.addCommand({
        name: "bold",
        bindKey: { win: "Ctrl-B", mac: "Cmd-B" },
        exec: () => handleBold(),
      });
      editor.commands.addCommand({
        name: "italic",
        bindKey: { win: "Ctrl-I", mac: "Cmd-I" },
        exec: () => handleItalic(),
      });
      editor.commands.addCommand({
        name: "undo",
        bindKey: { win: "Ctrl-Z", mac: "Cmd-Z" },
        exec: () => editor.undo(),
      });
      editor.commands.addCommand({
        name: "redo",
        bindKey: { win: "Ctrl-Y", mac: "Cmd-Y" },
        exec: () => editor.redo(),
      });
      editor.commands.addCommand({
        name: "insertLink",
        bindKey: { win: "Ctrl-K", mac: "Cmd-K" },
        exec: () => handleInsertLink(),
      });
      editor.commands.addCommand({
        name: "insertCode",
        bindKey: { win: "Ctrl-D", mac: "Cmd-D" },
        exec: () => handleInsertCode(),
      });
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("mdxDraft", mdxSource);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handlePublish = () => {
    try {
      console.log("Publishing:", mdxSource);
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 2000);
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  const handleBold = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    if (selection) {
      const isBold = selection.startsWith("**") && selection.endsWith("**");
      const newText = isBold ? selection.slice(2, -2) : `**${selection}**`;
      session.replace(editor.selection.getRange(), newText);
    } else {
      session.insert(cursor, "****");
      editor.moveCursorTo(cursor.row, cursor.column + 2);
    }
    editor.focus();
  };

  const handleItalic = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    if (selection) {
      const isItalic = selection.startsWith("*") && selection.endsWith("*");
      const newText = isItalic ? selection.slice(1, -1) : `*${selection}*`;
      session.replace(editor.selection.getRange(), newText);
    } else {
      session.insert(cursor, "**");
      editor.moveCursorTo(cursor.row, cursor.column + 1);
    }
    editor.focus();
  };

  const handleUndo = () => {
    if (!editorRef.current) return;
    editorRef.current.editor.undo();
    editorRef.current.editor.focus();
  };

  const handleRedo = () => {
    if (!editorRef.current) return;
    editorRef.current.editor.redo();
    editorRef.current.editor.focus();
  };

  const handleHeading = (level) => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();
    const prefix = "#".repeat(level) + " ";

    // Get current line content
    const line = session.getLine(cursor.row);
    const lineStart = { row: cursor.row, column: 0 };
    const lineEnd = { row: cursor.row, column: line.length };

    // Check if line already starts with heading markers
    const headingMatch = line.match(/^(#{1,3})\s/);

    if (headingMatch) {
      // Replace existing heading
      const newLine = prefix + line.substring(headingMatch[0].length);
      session.replace(
        {
          start: lineStart,
          end: lineEnd,
        },
        newLine
      );
    } else {
      // Add heading to beginning of line
      session.insert(lineStart, prefix);
    }

    editor.focus();
    setShowHeadingDropdown(false);
  };

  const handleBulletList = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    // Insert bullet at the start of the line
    const line = session.getLine(cursor.row);
    const lineStart = { row: cursor.row, column: 0 };

    if (line.trimStart().startsWith("- ")) {
      // Line already has a bullet
      return;
    }

    session.insert(lineStart, "- ");
    editor.focus();
  };

  const handleNumberedList = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    // Insert number at the start of the line
    const line = session.getLine(cursor.row);
    const lineStart = { row: cursor.row, column: 0 };

    if (line.trimStart().match(/^\d+\.\s/)) {
      // Line already has a number
      return;
    }

    session.insert(lineStart, "1. ");
    editor.focus();
  };

  const handleInsertLink = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    if (selection) {
      session.replace(editor.selection.getRange(), `[${selection}](url)`);
    } else {
      session.insert(cursor, "[link text](url)");
      editor.moveCursorTo(cursor.row, cursor.column + 1);
    }
    editor.focus();
  };

  const handleInsertImage = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    session.insert(cursor, "![alt text](image-url)");
    editor.focus();
  };

  const handleInsertCode = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    if (selection) {
      session.replace(editor.selection.getRange(), `\`${selection}\``);
    } else {
      session.insert(cursor, "``");
      editor.moveCursorTo(cursor.row, cursor.column + 1);
    }
    editor.focus();
  };

  const handleInsertCodeBlock = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const selection = editor.getSelectedText();
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();

    const codeBlock = "```\n" + (selection || "// code here") + "\n```";

    if (selection) {
      session.replace(editor.selection.getRange(), codeBlock);
    } else {
      session.insert(cursor, codeBlock);
      editor.moveCursorTo(cursor.row + 1, 0);
    }
    editor.focus();
  };

  const handleTogglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  const handleResetEditor = () => {
    if (
      confirm(
        "Reset editor to initial content? This will lose any unsaved changes."
      )
    ) {
      setMdxSource(initialContent);
    }
  };

  const handleFontSizeChange = (change) => {
    const newSize = Math.min(Math.max(editorFontSize + change, 12), 24);
    setEditorFontSize(newSize);
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col font-sans overflow-hidden">
      <header className="bg-gray-800/80 py-3 px-6 border-b border-gray-700 shrink-0 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            <span className="text-indigo-500">Dot</span>MDX Editor
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              ← Back to Home
            </Link>
            <Link
              href="/posts/sample-post"
              className="text-sm text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              Sample Post
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="h-full flex flex-col gap-4">
          <div className="py-2 px-3 md:px-4 rounded-xl border bg-gray-800 border-gray-700 flex flex-wrap items-center justify-between shadow-md">
            <div className="flex flex-wrap gap-2">
              <div className="flex">
                <button
                  onClick={handleBold}
                  className="p-2 rounded-l-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={handleItalic}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                    className="p-2 flex items-center bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                    title="Heading"
                  >
                    <Heading className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  {showHeadingDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-32 py-1 rounded-md shadow-lg z-10 bg-gray-800 border border-gray-700">
                      {[1, 2, 3].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleHeading(level)}
                          className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-700 text-gray-200"
                        >
                          H{level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBulletList}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNumberedList}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={handleInsertLink}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Insert Link (Ctrl+K)"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleInsertImage}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Insert Image"
                >
                  <Image className="w-4 h-4" />
                </button>
                <button
                  onClick={handleInsertCode}
                  className="p-2 bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Inline Code (Ctrl+D)"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={handleInsertCodeBlock}
                  className="p-2 rounded-r-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Code Block"
                >
                  <FileCode className="w-4 h-4" />
                </button>
              </div>

              <div className="flex">
                <button
                  onClick={handleUndo}
                  className="p-2 rounded-l-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  className="p-2 rounded-r-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex">
                <button
                  onClick={() => handleFontSizeChange(-1)}
                  className="p-2 rounded-l-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <span className="flex items-center justify-center w-8 bg-gray-700 text-gray-200">
                  {editorFontSize}
                </span>
                <button
                  onClick={() => handleFontSizeChange(1)}
                  className="p-2 rounded-r-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <button
                onClick={handleTogglePreview}
                className="p-2 rounded-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                title={isPreviewVisible ? "Hide Preview" : "Show Preview"}
              >
                {isPreviewVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleResetEditor}
                className="p-2 rounded-lg bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200"
                title="Reset to Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200"
              >
                <Save
                  className={`w-4 h-4 ${isSaved ? "text-green-300" : ""}`}
                />
                <span className="text-sm whitespace-nowrap">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>
              <button
                onClick={handlePublish}
                className="px-3 py-2 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
              >
                <UploadCloud
                  className={`w-4 h-4 ${isPublished ? "text-green-300" : ""}`}
                />
                <span className="text-sm whitespace-nowrap">
                  {isPublished ? "Published" : "Publish"}
                </span>
              </button>
            </div>
          </div>

          <div
            className={`grid ${
              isPreviewVisible ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } gap-4 h-[calc(100%-4rem)] overflow-hidden`}
          >
            <div className="flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <div className="px-4 py-2 border-b flex justify-between items-center bg-gray-800 border-gray-700">
                <h2 className="text-sm font-medium text-gray-300">Editor</h2>
                <div className="flex items-center text-xs">
                  <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                    Markdown
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-gray-900">
                <AceEditor
                  mode="markdown"
                  theme="one_dark"
                  value={mdxSource}
                  onChange={(value) => setMdxSource(value || "")}
                  name="mdx-editor"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                    wrap: true,
                    fontSize: editorFontSize,
                  }}
                  ref={editorRef}
                  height="100%"
                  width="100%"
                  className="h-full"
                />
              </div>
            </div>

            {isPreviewVisible && (
              <div className="flex flex-col rounded-xl overflow-hidden shadow-lg border border-gray-700">
                <div className="px-4 py-2 border-b bg-gray-800 border-gray-700">
                  <h2 className="text-sm font-medium text-gray-300">Preview</h2>
                </div>
                <div className="flex-1 overflow-auto p-6 text-gray-800">
                  <MDXPreviewer mdxSource={mdxSource} isEditor />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-2 px-6 border-t text-center shrink-0 bg-gray-800 border-gray-700">
        <p className="text-xs text-gray-400">
          Powered by <code className="font-mono text-indigo-400">mdxjs</code> •
          Made with ❤️
        </p>
      </footer>
    </div>
  );
}
