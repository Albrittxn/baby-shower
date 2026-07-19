import { getRedis, RSVP_LIST_KEY } from "../../../lib/redis";

export const runtime = "nodejs";

type StoredRsvp = {
  id: string;
  guestName: string;
  acceptedAt: string;
};

function cleanName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { name?: unknown; website?: unknown };
    const guestName = cleanName(payload.name);

    if (payload.website) {
      return Response.json({ success: true }, { status: 201 });
    }

    if (guestName.length < 2) {
      return Response.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (guestName.length > 80) {
      return Response.json({ error: "Please keep your name under 80 characters." }, { status: 400 });
    }

    const acceptedAt = new Date().toISOString();
    const rsvp: StoredRsvp = {
      id: crypto.randomUUID(),
      guestName,
      acceptedAt,
    };

    await getRedis().lpush(RSVP_LIST_KEY, rsvp);
    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "We could not save your RSVP. Please try again." },
      { status: 500 },
    );
  }
}
