"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "./hooks/useAgent";
import ReactMarkdown from "react-markdown";
import FloatingCharacters from "./components/FloatingCharacters";

/**
 * Single Terminal Session Component
 */
function TerminalSession({ isActive }: { isActive: boolean }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking, clearMessages } = useAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isActive]);

  useEffect(() => {
    if (isActive) {
      const focusInput = () => {
        inputRef.current?.focus();
      };

      const handleClick = () => {
        if (window.getSelection()?.toString() === "") {
          focusInput();
        }
      };
      
      const timeoutId = setTimeout(focusInput, 50);

      window.addEventListener("focus", focusInput);
      document.addEventListener("click", handleClick);
      return () => {
        window.removeEventListener("focus", focusInput);
        document.removeEventListener("click", handleClick);
        clearTimeout(timeoutId);
      };
    }
  }, [isActive]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput("");
    if (message.trim().toLowerCase() === "clear") {
      clearMessages();
      return;
    }
    await sendMessage(message);
  };

  return (
    <div className={`flex flex-col grow w-full h-full overflow-hidden ${isActive ? "flex" : "hidden"}`}>
      {/* Terminal Output */}
      <div className="grow overflow-y-auto p-4 scrollbar-custom font-mono text-sm md:text-base pb-2">
        <div className="text-green-700/80 mb-6 font-mono text-xs md:text-sm">
          <p>Coinbase AgentKit Terminal [Version 1.0.0]</p>
          <p>(c) 2024 Onchain Corp. All rights reserved.</p>
          <br />
          <p className="text-gray-500">System initialized. Connected to network.</p>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            {msg.sender === "user" ? (
              <div className="flex items-start group">
                <span className="text-green-500 mr-1 shrink-0 select-none font-bold">
                  user@agentkit:
                </span>
                <span className="text-blue-500 mr-2 shrink-0 select-none font-bold">~</span>
                <span className="text-white mr-2 shrink-0 select-none font-bold">$</span>
                <span className="text-gray-100 wrap-break-word font-medium">{msg.text}</span>
              </div>
            ) : (
              <div className="text-green-400 leading-relaxed pl-0 mb-4 whitespace-pre-wrap">
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
                    p: ({ children }) => <span className="mb-2 last:mb-0 block">{children}</span>,
                    code: ({ children }) => (
                      <span className="bg-green-900/20 text-green-300 px-1 py-0.5 rounded text-xs md:text-sm font-bold border border-green-900/30">{children}</span>
                    ),
                    pre: ({ children }) => (
                      <div className="bg-black/50 border border-green-800/40 p-3 rounded-sm my-2 overflow-x-auto text-xs md:text-sm shadow-[0_0_10px_rgba(0,0,0,0.3)]">{children}</div>
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

        {/* Input Line - Inline */}
        {!isThinking && (
        <div className="flex items-center font-mono text-sm md:text-base mt-2">
            <span className="text-green-500 mr-1 shrink-0 select-none font-bold">
              user@agentkit:
            </span>
            <span className="text-blue-500 mr-2 shrink-0 select-none font-bold">~</span>
            <span className="text-white mr-2 shrink-0 select-none font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            className="grow bg-transparent border-none outline-none text-white font-mono caret-green-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendMessage();
            }}
            disabled={isThinking}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        )}


        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

/**
 * Terminal Interface with Tabs
 */
export default function Home() {
  const [tabs, setTabs] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "terminal" }
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [nextId, setNextId] = useState(2);

  const addNewTab = () => {
    const newId = String(nextId);
    setTabs(prev => [...prev, { id: newId, name: `terminal-${nextId}` }]);
    setActiveTabId(newId);
    setNextId(prev => prev + 1);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close the last tab
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 md:p-4 bg-[#0a0a0a] overflow-hidden">
       {/* Floating Characters Background - fills entire viewport */}
       <FloatingCharacters characters="01" density={600} minSize={11} maxSize={14} />
       
       <div className="flex flex-col w-full max-w-5xl h-full md:h-[90vh] border border-green-800/50 bg-black shadow-[0_0_30px_rgba(0,255,0,0.05)] relative overflow-hidden rounded-lg z-20">

        {/* CRT Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-size-[100%_2px,3px_100%] opacity-20 md:rounded-lg"></div>
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-40 md:rounded-lg"></div>

        {/* Header with Tabs */}
        <header className="bg-green-900/10 border-b border-green-800/50 flex pt-2 px-2 md:pt-3 md:px-3 items-end gap-1 shrink-0 z-30 backdrop-blur-sm overflow-x-auto scrollbar-none">
          {/* Traffic Lights */}
          <div className="flex gap-1.5 mr-4 mb-2 items-center self-center pb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>

          {/* Tabs */}
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                group relative px-4 py-1.5 rounded-t-lg bg-black border border-b-0 text-xs md:text-sm font-mono cursor-pointer flex items-center gap-2 select-none min-w-30 max-w-50 transition-all
                ${activeTabId === tab.id 
                  ? "border-green-800/50 text-green-400 z-10" 
                  : "border-transparent bg-transparent text-green-700/50 hover:bg-green-900/10 hover:text-green-600"}
              `}
            >
              <span className="truncate grow">
                {activeTabId === tab.id ? "user@agentkit:~" : tab.name}
              </span>
              
              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className={`
                    w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all
                    ${activeTabId === tab.id ? "text-green-700" : ""}
                  `}
                >
                  ×
                </button>
              )}
              
              {/* Active Tab Indicator Line */}
              {activeTabId === tab.id && (
                <div className="absolute -bottom-px left-0 right-0 h-px bg-black z-20"></div>
              )}
            </div>
          ))}

          {/* New Tab Button */}
          <button
            onClick={addNewTab} // Fixed closing bracket
            className="mb-1 ml-1 p-1.5 text-green-700/50 hover:text-green-400 hover:bg-green-900/20 rounded-md transition-colors"
            title="New Terminal"
          >
            +
          </button>
        </header>

        {/* Main Content */}
        <main className="grow flex flex-col relative z-20 overflow-hidden bg-black/90">
             {tabs.map(tab => (
               <TerminalSession key={tab.id} isActive={activeTabId === tab.id} />
             ))}
        </main>

        {/* Footer */}
        <footer className="py-1.5 px-3 border-t border-green-800/30 text-[10px] text-green-700/60 bg-green-900/5 flex justify-between shrink-0 z-30 select-none">
          <div className="flex items-center gap-3">
             <span>RAM: 64KB OK</span>
             <span>PID: {activeTabId}</span>
             <span>AGENT_CORE: ACTIVE</span>
          </div>
          <div className="flex gap-3 text-green-700/40">
            <span>UTF-8</span>
            <span>Ln 1, Col 1</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
