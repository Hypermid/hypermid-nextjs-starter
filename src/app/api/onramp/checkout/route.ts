import { NextRequest, NextResponse } from "next/server";
import { hm } from "@/lib/hypermid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      walletAddress,
      cryptoToken,
      cryptoChain,
      fiatCurrency,
      fiatAmount,
      email,
      returnUrl,
    } = body;

    if (!walletAddress || !cryptoToken || !cryptoChain || !fiatCurrency || !fiatAmount) {
      return NextResponse.json(
        { error: "Missing required parameters: walletAddress, cryptoToken, cryptoChain, fiatCurrency, fiatAmount" },
        { status: 400 },
      );
    }

    const checkout = await hm.createOnrampCheckout({
      walletAddress,
      cryptoToken,
      cryptoChain,
      fiatCurrency,
      fiatAmount: Number(fiatAmount),
      email,
      returnUrl,
    });

    return NextResponse.json(checkout);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout";
    const status = (err as { status?: number }).status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
