import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl gap-4 rounded-2xl p-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-900 text-white"
        }`}
      >
        {/* Avatar */}
        <div className="mt-1 shrink-0">
          {isUser ? (
            <User size={22} />
          ) : (
            <Bot size={22} />
          )}
        </div>

        {/* Message Content */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">
            {isUser ? "You" : "NEXORA AI"}
          </h3>

          <div className="mt-2 leading-7">
            {isUser ? (
              <p className="whitespace-pre-wrap">
                {text}
              </p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  /* Headings */
                  h1: ({ children }) => (
                    <h1 className="mb-4 mt-2 text-2xl font-bold text-white">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-3 mt-5 text-xl font-bold text-white">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-4 text-lg font-semibold text-white">
                      {children}
                    </h3>
                  ),

                  /* Paragraph */
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">
                      {children}
                    </p>
                  ),

                  /* Bold */
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">
                      {children}
                    </strong>
                  ),

                  /* Unordered List */
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-5 list-disc space-y-1">
                      {children}
                    </ul>
                  ),

                  /* Ordered List */
                  ol: ({ children }) => (
                    <ol className="mb-4 ml-5 list-decimal space-y-1">
                      {children}
                    </ol>
                  ),

                  /* List Item */
                  li: ({ children }) => (
                    <li className="pl-1">
                      {children}
                    </li>
                  ),

                  /* Blockquote */
                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-4 border-zinc-600 pl-4 italic text-zinc-300">
                      {children}
                    </blockquote>
                  ),

                  /* Inline Code */
                  code: ({ children }) => (
                    <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-blue-300">
                      {children}
                    </code>
                  ),

                  /* Code Block */
                  pre: ({ children }) => (
                    <pre className="my-4 overflow-x-auto rounded-lg bg-black p-4 text-sm leading-6">
                      {children}
                    </pre>
                  ),

                  /* Links */
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      {children}
                    </a>
                  ),

                  /* Table */
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-700">
                      <table className="w-full border-collapse text-sm">
                        {children}
                      </table>
                    </div>
                  ),

                  /* Table Header */
                  thead: ({ children }) => (
                    <thead className="bg-zinc-800">
                      {children}
                    </thead>
                  ),

                  /* Table Body */
                  tbody: ({ children }) => (
                    <tbody>{children}</tbody>
                  ),

                  /* Table Row */
                  tr: ({ children }) => (
                    <tr className="border-b border-zinc-700 last:border-b-0">
                      {children}
                    </tr>
                  ),

                  /* Table Header Cell */
                  th: ({ children }) => (
                    <th className="border-r border-zinc-700 px-4 py-3 text-left font-semibold text-white last:border-r-0">
                      {children}
                    </th>
                  ),

                  /* Table Data Cell */
                  td: ({ children }) => (
                    <td className="border-r border-zinc-700 px-4 py-3 text-zinc-300 last:border-r-0">
                      {children}
                    </td>
                  ),
                }}
              >
                {text || ""}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;