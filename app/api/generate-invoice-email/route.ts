import { NextRequest, NextResponse } from "next/server";
import { getInvoiceEmailBody } from "@/src/templates/invoice-template";

export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json();
    const html = getInvoiceEmailBody(invoice);

    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("Error generating invoice email HTML:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice email HTML" },
      { status: 500 },
    );
  }
}
