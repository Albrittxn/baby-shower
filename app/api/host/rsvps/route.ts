import { getRedis, RSVP_LIST_KEY } from "../../../../lib/redis";

export const runtime = "nodejs";

type StoredRsvp = {
  id: string;
  guestName: string;
  acceptedAt: string;
};

function isAuthorized(pin: unknown) {
  const adminPin = process.env.RSVP_ADMIN_PIN || "Jasmine!0822";
  return typeof pin === "string" && pin === adminPin;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { pin?: unknown };

    if (!isAuthorized(payload.pin)) {
      return Response.json({ error: "That host PIN is not correct." }, { status: 401 });
    }

    const guestList = await getRedis().lrange<StoredRsvp>(RSVP_LIST_KEY, 0, 499);
    return Response.json({ rsvps: guestList });
  } catch {
    return Response.json(
      { error: "The guest list could not be loaded. Please try again." },
      { status: 500 },
    );
  }
}
