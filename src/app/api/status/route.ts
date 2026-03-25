import { NextRequest, NextResponse } from "next/server";
import { hm } from "@/lib/hypermid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const provider = searchParams.get("provider");
    const txHash = searchParams.get("txHash");
    const correlationId = searchParams.get("correlationId");
    const fromChain = searchParams.get("fromChain");
    const toChain = searchParams.get("toChain");

    if (provider === "near-intents") {
      if (!correlationId) {
        return NextResponse.json(
          { error: "Missing correlationId for near-intents status" },
          { status: 400 },
        );
      }
      const status = await hm.getStatus({
        provider: "near-intents",
        correlationId,
      });
      return NextResponse.json(status);
    }

    if (!txHash) {
      return NextResponse.json(
        { error: "Missing txHash parameter" },
        { status: 400 },
      );
    }

    const status = await hm.getStatus({
      txHash,
      fromChain: fromChain ? Number(fromChain) : undefined,
      toChain: toChain ? Number(toChain) : undefined,
    });

    return NextResponse.json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch status";
    const status = (err as { status?: number }).status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
