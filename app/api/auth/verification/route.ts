import { signIn } from "@/auth";
import { verifyEmail } from "@/components/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = NextResponse.redirect(
        new URL("/signin", process.env.APP_BASE_URL),
    );

    const params = req.nextUrl.searchParams;
    const email = params.get("email");
    const code = params.get("code");

    if (!email || !code) {
        return NextResponse.json(
            {
                message: "Invalid request",
            },
            { status: 400 },
        );
    }

    if (code.length !== 6 && isNaN(Number(code))) {
        return NextResponse.json(
            {
                message: "Invalid code",
            },
            { status: 400 },
        );
    }

    await verifyEmail(email, Number(code));

    response.cookies.set("signin_verificated_message", "true", {
        maxAge: 600,
        httpOnly: false,
    });

    return response;
}
