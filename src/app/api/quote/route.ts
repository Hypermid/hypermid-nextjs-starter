import { NextRequest, NextResponse } from "next/server";
import { hm } from "@/lib/hypermid";
import { PLACEHOLDER_ADDRESS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const fromChain = searchParams.get("fromChain");
    const fromToken = searchParams.get("fromToken");
    const fromAmount = searchParams.get("fromAmount");
    const toChain = searchParams.get("toChain");
    const toToken = searchParams.get("toToken");
    const fromAddress = searchParams.get("fromAddress") || PLACEHOLDER_ADDRESS;
    const slippage = searchParams.get("slippage");

    if (!fromChain || !fromToken || !fromAmount || !toChain || !toToken) {
      return NextResponse.json(
        { error: "Missing required parameters: fromChain, fromToken, fromAmount, toChain, toToken" },
        { status: 400 },
      );
    }

    const quote = await hm.getQuote({
      fromChain: Number(fromChain),
      fromToken,
      fromAmount,
      toChain: Number(toChain),
      toToken,
      fromAddress,
      slippage: slippage ? Number(slippage) : undefined,
    });

    return NextResponse.json(quote);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch quote";
    const status = (err as { status?: number }).status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
