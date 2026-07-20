import { NextResponse } from "next/server";

// IMPORTANT: set these in .env.local
// GOOGLE_PLACES_API_KEY=your_api_key_here
// GOOGLE_PLACE_ID=your_place_id_here

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      {
        error:
          "Configura GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID nel file .env.local",
      },
      { status: 200 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total,name&language=it&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.status, message: data.error_message || "Errore Google Places API" },
        { status: 200 }
      );
    }

    const reviews = (data.result?.reviews || []).map((r: any) => ({
      author: r.author_name,
      authorPhoto: r.profile_photo_url,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
      time: r.time,
    }));

    return NextResponse.json({
      rating: data.result?.rating,
      totalReviews: data.result?.user_ratings_total,
      reviews,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", message: String(err) },
      { status: 200 }
    );
  }
}
