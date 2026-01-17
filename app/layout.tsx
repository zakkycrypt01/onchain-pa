import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MiniAppProvider from "./components/MiniAppProvider";
import { UserProvider } from "./providers/UserContext";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Onchain Terminal PA",
  description: "Terminal interface for AgentKit",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://your-domain.com/embed-image.png",
      button: {
        title: "Launch Terminal",
        action: {
          type: "launch_miniapp",
          name: "Onchain Terminal PA",
          url: "https://your-domain.com",
        },
      },
    }),
  },
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
    <html lang="en" style={{ scrollBehavior: 'auto' }}>
      <body
        className={`${jetbrainsMono.variable} font-mono bg-black text-green-500 min-h-screen flex flex-col antialiased selection:bg-green-500 selection:text-black`}
      >
        <UserProvider>
          <MiniAppProvider>
            {children}
          </MiniAppProvider>
        </UserProvider>
      </body>
    </html>
  );
}
