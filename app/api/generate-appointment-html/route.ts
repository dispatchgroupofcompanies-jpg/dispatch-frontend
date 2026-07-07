import { NextRequest, NextResponse } from "next/server";
import { getAppointmentTemplate } from "@/src/templates/appointment-template";

export async function POST(request: NextRequest) {
  try {
    const appointment = await request.json();
    const html = getAppointmentTemplate(appointment);

    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("Error generating appointment HTML:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate appointment HTML" },
      { status: 500 },
    );
  }
}
