import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { invalidateMessagesCache } from "@/lib/admin-cache";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Save message into database
    try {
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message,
        },
      });
      invalidateMessagesCache();
    } catch (dbError) {
      console.warn("Could not persist contact message to database:", dbError);
    }

    // Send notification email
    try {
      await sendContactNotification(name, email, phone, subject, message);
    } catch (emailErr) {
      console.warn("Contact notification email error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received. Our concierge will reply within 24 hours.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}
