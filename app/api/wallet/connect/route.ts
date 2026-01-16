import { NextResponse } from "next/server";
import { prepareAgentkitAndWalletProvider } from "@/app/api/agent/prepare-agentkit";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { privateKey } = await req.json();

    if (!process.env.NEXT_PUBLIC_CDP_API_KEY_ID) {
      return NextResponse.json(
        { error: "CDP API key not configured" },
        { status: 500 }
      );
    }

    // Initialize embedded wallet
    const { walletProvider } = await prepareAgentkitAndWalletProvider(privateKey);

    const address = walletProvider.getAddress();
    const network = walletProvider.getNetwork();

    return NextResponse.json({
      success: true,
      address,
      networkId: network.networkId,
      message: "Wallet connected successfully",
    });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect wallet",
      },
      { status: 400 }
    );
  }
}
