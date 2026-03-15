import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function proxy() {
    const response = NextResponse.next();

    const cookieStore = response.cookies;
    let theme = (await cookies()).get("theme")?.value;

    if (!theme || !["light", "dark"].includes(theme)) {
        cookieStore.set("theme", "light");
    }

    return response;
}
