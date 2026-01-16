import { NextResponse } from "next/server";
import { prepareAgentkitAndWalletProvider } from "@/app/api/agent/prepare-agentkit";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_CDP_API_KEY_ID) {
      return NextResponse.json(
        { error: "CDP API key not configured" },
        { status: 500 }
      );
    }

    // Initialize default embedded wallet
    const { walletProvider } = await prepareAgentkitAndWalletProvider();

    const address = walletProvider.getAddress();
    const network = walletProvider.getNetwork();

    return NextResponse.json({
      success: true,
      address,
      networkId: network.networkId,
      message: "Wallet details retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving wallet details:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve wallet details",
      },
      { status: 400 }
    );
  }
}
