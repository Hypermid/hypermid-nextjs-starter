import { NextRequest, NextResponse } from "next/server";
import { hm } from "@/lib/hypermid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fromChain,
      fromToken,
      fromAmount,
      toChain,
      toToken,
      fromAddress,
      toAddress,
      depositMode,
      slippage,
    } = body;

    if (!fromChain || !fromToken || !fromAmount || !toChain || !toToken || !fromAddress || !toAddress) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const result = await hm.execute({
      fromChain: Number(fromChain),
      fromToken,
      fromAmount,
      toChain: Number(toChain),
      toToken,
      fromAddress,
      toAddress,
      depositMode,
      slippage: slippage ? Number(slippage) : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to execute swap";
    const status = (err as { status?: number }).status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
