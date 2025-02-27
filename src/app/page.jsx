"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto py-6 px-4 flex justify-between items-center border-b border-gray-800"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          DotMDX
        </h1>
        <nav className="flex gap-6">
          <Link
            href="/editor"
            className="text-gray-400 hover:text-purple-400 font-medium transition-colors"
          >
            Write
          </Link>
          <Link
            href="/posts/sample-post"
            className="text-gray-400 hover:text-blue-400 font-medium transition-colors"
          >
            Sample
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-4xl mx-auto py-16 px-4 text-center"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-100 mb-6 leading-tight bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
          Write Vibrantly with MDX
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          DotMDX fuses Markdown’s ease with JSX’s flair—create bold, colorful
          stories.
        </p>
        <Link
          href="/editor"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Get Started
        </Link>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto py-12 px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-purple-400 mb-4">
              Vivid Editor
            </h3>
            <p className="text-gray-400">
              A sleek, colorful space to craft your MDX masterpieces.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-pink-400 mb-4">
              Live Canvas
            </h3>
            <p className="text-gray-400">
              Watch your vibrant content unfold as you write.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">
              Dynamic Elements
            </h3>
            <p className="text-gray-400">
              Add flair with custom MDX components effortlessly.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Showcase Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto py-12 px-4 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
          Unleash Your Creativity
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg text-gray-400 mb-8"
        >
          DotMDX turns your ideas into bold, expressive narratives with a splash
          of color.
        </motion.p>
        <Link
          href="/posts/sample-post"
          className="inline-block px-6 py-2 border border-gray-100 text-gray-100 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 font-medium"
        >
          Explore a Sample
        </Link>
      </motion.section>

      {/* Subtle Animation Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: isHovered ? 80 : -160, y: isHovered ? 80 : -160 }}
          transition={{ duration: 0.5 }}
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto py-6 px-4 border-t border-gray-800 text-center text-gray-500 text-sm"
      >
        <p>© 2025 DotMDX. Crafted with Passion.</p>
      </motion.footer>
    </div>
  );
}
