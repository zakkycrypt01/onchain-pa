"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "./hooks/useAgent";
import ReactMarkdown from "react-markdown";
import FloatingCharacters from "./components/FloatingCharacters";

/**
 * Landing Page Component
 */
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-black text-green-500 relative overflow-hidden">
      <FloatingCharacters />
      
      <div className="relative z-10 max-w-2xl px-6 text-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-green-400 font-mono">
            ONCHAIN PA
          </h1>
          <p className="text-xl md:text-2xl text-green-500/80 font-mono mb-2">
            Coinbase AgentKit Terminal
          </p>
          <p className="text-sm md:text-base text-green-600/70 font-mono">
            Interact with blockchain through natural language
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-12 text-left max-w-md mx-auto">
          <div className="border border-green-700/40 p-4 bg-green-950/10 rounded">
            <p className="text-green-400 font-bold text-sm">✓ Send Crypto</p>
            <p className="text-green-600 text-xs mt-1">ETH, USDC, and more</p>
          </div>
          <div className="border border-green-700/40 p-4 bg-green-950/10 rounded">
            <p className="text-green-400 font-bold text-sm">✓ Swap Tokens</p>
            <p className="text-green-600 text-xs mt-1">DEX powered swaps</p>
          </div>
          <div className="border border-green-700/40 p-4 bg-green-950/10 rounded">
            <p className="text-green-400 font-bold text-sm">✓ Smart Contracts</p>
            <p className="text-green-600 text-xs mt-1">Deploy & interact</p>
          </div>
          <div className="border border-green-700/40 p-4 bg-green-950/10 rounded">
            <p className="text-green-400 font-bold text-sm">✓ NFT Management</p>
            <p className="text-green-600 text-xs mt-1">Manage your assets</p>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="px-8 py-3 border-2 border-green-500 text-green-500 font-mono font-bold hover:bg-green-500 hover:text-black transition-colors duration-200 text-lg"
        >
          $ ENTER TERMINAL
        </button>

        {/* Footer */}
        <div className="mt-12 text-green-700/50 text-xs font-mono">
          <p>© 2024 Onchain Corp. All rights reserved.</p>
          <p className="mt-2">Powered by Coinbase AgentKit</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Single Terminal Session Component
 */
function TerminalSession({ isActive }: { isActive: boolean }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isThinking, clearMessages } = useAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDemo, setShowDemo] = useState(true);
  const [demoTypedChars, setDemoTypedChars] = useState(0);
  const [demoResponseLines, setDemoResponseLines] = useState(0);
  const [demoPhase, setDemoPhase] = useState(0); // 0: asking capabilities, 1: showing transaction

  const demoPhase0Prompt = "what can the agent do?";
  const demoPhase0Response = [
    "• Send/receive crypto (ETH, USDC, etc.)",
    "• Check wallet balances",
    "• Swap tokens on DEX",
    "• Deploy smart contracts",
    "• Manage NFTs",
    "• Execute batch transactions"
  ];

  const demoPhase1Prompt = "send 1 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f42bE";
  const demoPhase1Response = [
    "Processing transaction...",
    "✓ Approved USDC spend",
    "✓ Transaction submitted",
    "✓ Hash: 0x3a2b1c...",
    "Transfer complete!"
  ];

  const scrollToBottom = () => {
    if (isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isActive]);

  // Consolidated demo animation effect - all phases in one effect
  useEffect(() => {
    if (!showDemo || !isActive) return;

    let timer: NodeJS.Timeout;

    // Phase 0: Typing animation for "what can the agent do?"
    if (demoPhase === 0 && demoTypedChars < demoPhase0Prompt.length) {
      timer = setTimeout(() => {
        setDemoTypedChars(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }

    // Phase 0: Response capabilities (line by line)
    if (demoPhase === 0 && demoTypedChars === demoPhase0Prompt.length && demoResponseLines < demoPhase0Response.length) {
      timer = setTimeout(() => {
        setDemoResponseLines(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }

    // Transition to Phase 1 after Phase 0 completes
    if (demoPhase === 0 && demoTypedChars === demoPhase0Prompt.length && demoResponseLines === demoPhase0Response.length) {
      timer = setTimeout(() => {
        setDemoPhase(1);
        setDemoTypedChars(0);
        setDemoResponseLines(0);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Phase 1: Typing animation for transaction
    if (demoPhase === 1 && demoTypedChars < demoPhase1Prompt.length) {
      timer = setTimeout(() => {
        setDemoTypedChars(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }

    // Phase 1: Response appearing (line by line)
    if (demoPhase === 1 && demoTypedChars === demoPhase1Prompt.length && demoResponseLines < demoPhase1Response.length) {
      timer = setTimeout(() => {
        setDemoResponseLines(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }

    // Auto-clear demo after Phase 1 completes
    if (demoPhase === 1 && demoTypedChars === demoPhase1Prompt.length && demoResponseLines === demoPhase1Response.length) {
      timer = setTimeout(() => {
        setShowDemo(false);
        setDemoPhase(0);
        setDemoTypedChars(0);
        setDemoResponseLines(0);
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [showDemo, isActive, demoPhase, demoTypedChars, demoResponseLines]);

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

        {showDemo && (
          <>
            {/* Phase 0: Asking what the agent can do */}
            {(demoPhase === 0 || demoPhase === 1) && (
              <>
                <div className="flex items-start group mb-2">
                  <span className="text-green-500 mr-1 shrink-0 select-none font-bold">user@agentkit:</span>
                  <span className="text-blue-500 mr-2 shrink-0 select-none font-bold">~</span>
                  <span className="text-white mr-2 shrink-0 select-none font-bold">$</span>
                  <span className="text-gray-100 font-medium">{demoPhase0Prompt.slice(0, demoPhase === 0 ? demoTypedChars : demoPhase0Prompt.length)}</span>
                  {demoPhase === 0 && demoTypedChars < demoPhase0Prompt.length && <span className="text-green-500 animate-blink">_</span>}
                </div>

                {demoPhase === 0 && demoTypedChars === demoPhase0Prompt.length && (
                  <div className="text-green-400 leading-relaxed pl-0 mb-6 whitespace-pre-wrap text-sm space-y-1">
                    {demoPhase0Response.map((line, idx) => (
                      idx < demoResponseLines && <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}

                {demoPhase === 1 && (
                  <div className="text-green-400 leading-relaxed pl-0 mb-6 whitespace-pre-wrap text-sm space-y-1">
                    {demoPhase0Response.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Phase 1: Transaction demo */}
            {demoPhase === 1 && (
              <>
                <div className="flex items-start group mb-2 mt-4">
                  <span className="text-green-500 mr-1 shrink-0 select-none font-bold">user@agentkit:</span>
                  <span className="text-blue-500 mr-2 shrink-0 select-none font-bold">~</span>
                  <span className="text-white mr-2 shrink-0 select-none font-bold">$</span>
                  <span className="text-gray-100 font-medium">{demoPhase1Prompt.slice(0, demoTypedChars)}</span>
                  {demoTypedChars < demoPhase1Prompt.length && <span className="text-green-500 animate-blink">_</span>}
                </div>

                {demoTypedChars === demoPhase1Prompt.length && (
                  <div className="text-green-400 leading-relaxed pl-0 mb-6 whitespace-pre-wrap text-sm space-y-1">
                    {demoPhase1Response.map((line, idx) => (
                      idx < demoResponseLines && <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

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

        {/* Ready for input prompt */}
        {!isThinking && !showDemo && (
          <div className="text-green-600 text-xs mb-3 opacity-70">
            Ready for input. Type your command below:
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
  const [showLanding, setShowLanding] = useState(true);
  const [tabs, setTabs] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "terminal" }
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [nextId, setNextId] = useState(2);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

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
