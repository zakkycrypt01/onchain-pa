"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "./hooks/useAgent";
import ReactMarkdown from "react-markdown";

/**
 * Terminal Interface for AgentKit
 */
export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking } = useAgent();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on click
  useEffect(() => {
    const handleClick = () => {
      // Only focus if user isn't selecting text
      if (window.getSelection()?.toString() === "") {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col flex-grow w-full h-full overflow-hidden">
      {/* Terminal Output */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-custom space-y-2 font-mono text-sm md:text-base pb-2">
        {/* Welcome Message */}
        <div className="text-green-700/80 mb-6 font-mono text-xs md:text-sm">
          <p>Coinbase AgentKit Terminal [Version 1.0.0]</p>
          <p>(c) 2024 Onchain Corp. All rights reserved.</p>
          <br />
          <p className="text-gray-500">System initialized. Connected to network.</p>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col mb-4">
            {msg.sender === "user" ? (
              <div className="flex items-start group">
                <span className="text-green-500 mr-3 shrink-0 select-none font-bold">
                  user@onchain:~$
                </span>
                <span className="text-gray-100 break-words font-medium">{msg.text}</span>
              </div>
            ) : (
              <div className="mt-2 text-green-400 leading-relaxed pl-0 md:pl-4">
                <ReactMarkdown
                  components={{
                    a: (props) => (
                      <a
                        {...props}
                        className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children }) => (
                      <code className="bg-green-900/20 text-green-300 px-1 py-0.5 rounded text-xs md:text-sm font-bold border border-green-900/30">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-black/50 border border-green-800/40 p-3 rounded-sm my-3 overflow-x-auto text-xs md:text-sm scrollbar-custom shadow-[0_0_10px_rgba(0,0,0,0.3)]">{children}</pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc ml-5 mb-2 marker:text-green-600">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-5 mb-2 marker:text-green-600">{children}</ol>,
                    strong: ({ children }) => <strong className="text-green-300 font-bold">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-green-800/60 pl-4 italic text-green-600/80 my-2">{children}</blockquote>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center text-green-500 animate-pulse mt-2">
            <span className="w-2.5 h-4 bg-green-500 block mr-2"></span>
            <span className="text-xs uppercase tracking-wider opacity-70">Processing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Line */}
      <div className="p-3 md:p-4 bg-black/95 shrink-0 z-20 border-t border-green-900/20 backdrop-blur">
        <div className="flex items-center text-green-500 font-mono text-sm md:text-base">
          <span className="mr-3 shrink-0 font-bold hidden sm:block">user@onchain:~$</span>
          <span className="mr-2 shrink-0 font-bold sm:hidden">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-white font-mono caret-green-500 placeholder-green-900/30"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendMessage();
            }}
            autoFocus
            disabled={isThinking}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
