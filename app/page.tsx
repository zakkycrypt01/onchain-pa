"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "./hooks/useAgent";
import ReactMarkdown from "react-markdown";
import FloatingCharacters from "./components/FloatingCharacters";

/**
 * Landing Page Component
 */
function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="w-full bg-black text-white selection:bg-blue-500 selection:text-white">
      <FloatingCharacters />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-blue-500/20 px-6 lg:px-40 py-4 backdrop-blur-md sticky top-0 bg-black/50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <div className="w-8 h-8 text-blue-500 flex items-center justify-center">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" />
              </svg>
            </div>
            <h2 className="text-base font-bold leading-tight tracking-tight uppercase">
              Onchain PA
            </h2>
          </div>

          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-9">
              <a
                href="#"
                className="text-white/70 hover:text-blue-500 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-blue-500 transition-colors text-sm font-medium"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-blue-500 transition-colors text-sm font-medium"
              >
                Github
              </a>
            </div>
            <button className="px-4 h-10 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-all hover:scale-105 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 lg:px-40 py-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      >
        <div className="max-w-[1200px] w-full text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-4">
            The Onchain <span className="text-blue-500 italic">AI Terminal</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Deploy, trade, and manage assets via a high-performance CLI agent.
            Autonomous, efficient, and direct to the protocol.
          </p>
        </div>

        {/* Terminal Window Mockup */}
        <div
          className="max-w-[900px] w-full bg-[#050505] rounded-xl border border-blue-500/30 overflow-hidden shadow-2xl relative"
          style={{
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
          }}
        >
          {/* Window Bar */}
          <div className="flex items-center justify-between px-4 py-6 bg-[#111] border-b border-blue-500/20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
              onchain-pa-session --v1.0.4
            </span>
            <div className="w-3"></div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm md:text-base min-h-[300px] relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0) 100%)",
                backgroundSize: "100% 100px"
              }}
            ></div>

            <div className="relative z-10 space-y-2">
              <div className="flex gap-2">
                <span className="text-blue-500">root@onchain-pa:</span>
                <span className="text-white">init --agent=alpha-1</span>
              </div>

              <div className="text-white/50 italic">
                [System] Initializing secure wallet enclave...
              </div>

              <div className="text-green-400">
                [Success] Connection established with Ethereum Mainnet
              </div>

              <div className="flex gap-2 mt-4">
                <span className="text-blue-500">root@onchain-pa:</span>
                <span className="text-white">
                  swap 10.0 ETH to USDC --slippage 0.5%
                </span>
              </div>

              <div className="text-white/50 italic">
                [Processing] Calculating optimal routing across 14 DEXs...
              </div>

              <div className="text-white/80 leading-relaxed">
                &gt; Swap path: ETH -&gt; Uniswap v3 -&gt; Curve -&gt; USDC
                <br />
                &gt; Expected output: 24,420.12 USDC
                <br />
                &gt; Confirm execution? [Y/n]
              </div>

              <div className="flex gap-2">
                <span className="text-blue-500">root@onchain-pa:</span>
                <span className="text-white">Y</span>
              </div>

              <div className="text-green-400">
                [Success] Tx hash: 0x4f2a...9b11 (Confirmed in 12s)
              </div>

              <div className="flex gap-1 items-center mt-2">
                <span className="text-blue-500">root@onchain-pa:</span>
                <span
                  className="w-2 h-5 bg-blue-500"
                  style={{
                    animation: "blink 1s step-start infinite"
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="mt-12">
          <a
            href="/terminal"
            className="inline-block px-8 h-14 bg-blue-500 text-white text-lg font-bold rounded-lg hover:bg-blue-600 transition-all border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            Launch Terminal
          </a>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="w-full px-6 lg:px-40 py-24 bg-black border-t border-blue-500/20">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight uppercase mb-4">
              Capabilities <span className="text-blue-500">.exe</span>
            </h2>
            <p className="text-white/60 text-lg font-light max-w-[720px]">
              Your autonomous agent for the decentralized web.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "contracts",
                icon: "< />",
                title: "Smart Contracts",
                desc: "Compile and deploy with natural language commands. Full verification and audit readiness directly via the CLI."
              },
              {
                id: "portfolio",
                icon: "📊",
                title: "Portfolio Management",
                desc: "Real-time analytics across all chains. Automated rebalancing and risk mitigation protocols running 24/7."
              },
              {
                id: "trading",
                icon: "⚙️",
                title: "Automated Trading",
                desc: "Set-and-forget algorithmic execution. High-performance logic for liquidations, arbitrage, and limit orders."
              }
            ].map((feature) => (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`flex flex-col gap-4 rounded-xl border p-8 transition-all ${
                  hoveredFeature === feature.id
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40"
                }`}
              >
                <div
                  className={`p-3 rounded-lg w-fit text-2xl transition-colors ${
                    hoveredFeature === feature.id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold uppercase tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm font-mono leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 lg:px-40 py-24 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl border-2 border-blue-500/30 bg-black p-10 md:p-16 relative overflow-hidden"
            style={{
              boxShadow: "0 0 50px rgba(59, 130, 246, 0.15)"
            }}
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl font-bold leading-tight mb-3">
                Ready to go onchain?
              </h2>
              <p className="text-white/60 text-lg font-light">
                Initialize your personal AI agent and start trading today.
              </p>
            </div>

            <div className="relative z-10 flex gap-4 flex-col sm:flex-row">
              <button
                onClick={onEnter}
                className="px-6 h-12 bg-blue-500 text-white text-base font-bold rounded-lg hover:bg-blue-600 transition-all whitespace-nowrap"
              >
                Initialize Session
              </button>
              <button className="px-6 h-12 border border-blue-500/30 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
                View Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-blue-500/10 px-6 lg:px-40 py-10 bg-black">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgb(59,130,246)]"></span>
            System Status: All chains operational
          </div>

          <div className="flex gap-8">
            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
            >
              Twitter / X
            </a>
            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-white/40 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
            >
              Legal
            </a>
          </div>

          <div className="text-white/20 text-[10px] font-mono">
            © 2024 ONCHAIN PA CORE. v1.0.4-STABLE
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
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
      messagesEndRef.current?.scrollIntoView();
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
