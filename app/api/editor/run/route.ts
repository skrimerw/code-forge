import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import fs from "fs";

/**
 * {
 *      lang: string,
 *      code: string
 * }
 *
 */

const RunCodeSchema = z.object({
    lang: z
        .string()
        .toLowerCase()
        .refine(
            (data) => {
                if (data === "javascript" || data === "python") return true;
            },
            {
                error: "Unsupported language",
            },
        )
        .nonempty("'lang' option is required"),
    code: z.string().nonempty("'code' option is required"),
});

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success, data, error } = RunCodeSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { error: z.treeifyError(error) },
            { status: 400 },
        );
    }

    eval(data.code)

    return NextResponse.json({});
}
