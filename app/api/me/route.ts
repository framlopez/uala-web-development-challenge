import { NextResponse } from "next/server";
import { GetMeResponse } from "./types";

export async function GET() {
  try {
    // Información fake del usuario
    const user: GetMeResponse = {
      id: "usr_123456789",
      firstname: "Francisco",
      lastname: "López",
      email: "frammlopez@gmail.com",
      avatarUrl:
        "https://media.licdn.com/dms/image/v2/D4D03AQGaKhPk8lPzbw/profile-displayphoto-scale_400_400/B4DZiKD1ZPG8Ak-/0/1754662918375?e=1758153600&v=beta&t=q9lb2V7zb9Xly3LbZ5DmNYGjOWt2lfmwBHd0Z982-_Y",
    };

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
