import { storeFile } from "@/actions/save-editor-images";
import { auth } from "@/auth";
import prisma from "@/prisma/prisma-client";
import { rm } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import z from "zod";
import mime from "mime";
import { randomBytes } from "crypto";
import { EditCourseSchema } from "@/lib/schemas/course";

export async function DELETE(
    _req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const id = (await ctx.params).id;
    const user = (await auth())?.user;

    const findCourse = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (findCourse?.userId !== user?.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const deletedCourse = await prisma.course.delete({
        where: {
            id: Number(id),
        },
    });

    if (deletedCourse.imageUrl) {
        await rm(path.join("./public", deletedCourse.imageUrl));
    }

    return NextResponse.json({});
}

export async function PUT(
    req: NextRequest,
    ctx: RouteContext<"/api/courses/[id]">,
) {
    const formData = await req.formData();
    const id = (await ctx.params).id;
    const user = (await auth())?.user;

    const body = {
        logo: formData.get("logo"),
        title: formData.get("title"),
        description: formData.get("description"),
    };

    const findCourse = await prisma.course.findFirst({
        where: {
            id: Number(id),
        },
    });

    if (!findCourse) {
        return NextResponse.json(
            { message: "This record doesn't exist" },
            { status: 400 },
        );
    }

    if (findCourse?.userId !== user?.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { success, data, error } = EditCourseSchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { message: z.treeifyError(error) },
            { status: 400 },
        );
    }

    let iconPath = "";

    if (data.logo instanceof File) {
        const ext = mime.getExtension(data.logo.type);
        const fileName = `${randomBytes(16).toString("hex")}.${ext}`;

        if (!data.logo.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "icon must be an image" },
                { status: 400 },
            );
        }

        await storeFile(
            "./public/uploads/courses",
            fileName,
            Buffer.from(await data.logo.arrayBuffer()),
        );

        const oldUrl = findCourse.imageUrl;

        if (oldUrl) {
            await rm(path.join("./public", oldUrl));
        }

        iconPath = "/uploads/courses/" + fileName;
    }

    if (typeof data.logo === "string") {
        iconPath = data.logo;
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id: Number(id),
        },
        data: {
            title: data.title,
            description: data.description,
            imageUrl: iconPath,
        },
    });

    return NextResponse.json(updatedCourse);
}
