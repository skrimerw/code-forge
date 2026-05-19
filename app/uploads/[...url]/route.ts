import { NextRequest } from "next/server";
import fsPromises from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/uploads/[...url]">
) {
  const ctxPath = (await ctx.params).url.join("/");
  const filePath = path.join(process.cwd(), "/public/uploads/", ctxPath);

  let file: NonSharedBuffer | null = null;

  try {
    file = await fsPromises.readFile(filePath);
  } catch (e) {
    return new Response(null, {
      status: 400,
    });
  }

  return new Response(file, {
    status: 200,
  });
}
