import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Onchain Terminal PA",
  description: "Terminal interface for AgentKit",
};

/**
 * Root layout for the page
 *
 * @param {object} props - The props for the root layout
 * @param {React.ReactNode} props.children - The children for the root layout
 * @returns {React.ReactNode} The root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} font-mono bg-black text-green-500 min-h-screen flex flex-col antialiased selection:bg-green-500 selection:text-black overflow-hidden`}
      >
        <div className="fixed inset-0 flex items-center justify-center p-0 md:p-4 bg-[#0a0a0a]">
          <div className="flex flex-col w-full max-w-5xl h-full md:h-[90vh] border border-green-800/50 bg-black shadow-[0_0_30px_rgba(0,255,0,0.05)] relative overflow-hidden rounded-lg">
            
            {/* CRT Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-[length:100%_2px,3px_100%] opacity-20 md:rounded-lg"></div>
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-40 md:rounded-lg"></div>

            {/* Header */}
            <header className="bg-green-900/10 border-b border-green-800/50 p-2 md:p-3 flex justify-between items-center shrink-0 z-30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 ml-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-3 text-xs md:text-sm font-bold text-green-500/80 flex items-center gap-2">
                  <span className="opacity-50">user@onchain-pa:</span>
                  <span className="text-blue-400/80">~/agent-kit</span>
                </div>
              </div>
              <div className="text-[10px] md:text-xs text-green-600/60 font-mono hidden sm:block">
                connection: encrypted (tls 1.3)
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col relative z-20 overflow-hidden bg-black/90">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-1.5 px-3 border-t border-green-800/30 text-[10px] text-green-700/60 bg-green-900/5 flex justify-between shrink-0 z-30 select-none">
              <div className="flex items-center gap-3">
                 <span>RAM: 64KB OK</span>
                 <span>AGENT_CORE: ACTIVE</span>
              </div>
              <div className="flex gap-3 text-green-700/40">
                <span>UTF-8</span>
                <span>Ln 1, Col 1</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
