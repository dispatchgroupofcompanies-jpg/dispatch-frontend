import { NextRequest, NextResponse } from "next/server";
import { getInvoiceTemplate } from "@/src/templates/invoice-template";

export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json();
    const html = getInvoiceTemplate(invoice);

    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("Error generating invoice HTML:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice HTML" },
      { status: 500 },
    );
  }
}
