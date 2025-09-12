import { userService } from "@/lib/server/services/user.service";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request);

  switch (event.type) {
    case "user.created":
      const { last_name, first_name, email_addresses, id } = event.data;

      await userService.createUser({
        email: email_addresses[0].email_address,
        firstName: first_name as string,
        lastName: last_name as string,
        id,
      });

      break;
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
