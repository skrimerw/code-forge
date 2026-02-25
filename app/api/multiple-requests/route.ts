import redisClient from "@/lib/redis";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const arr = Array.from({ length: 10 });

    const resp = await axios.all(
        arr.map(() =>
            axios.post("http://localhost:3000/api/editor/run", {
                lang: "javascript",
                code: `setTimeout(() => {console.log("load test passed")}, 1000)`,
            }),
        ),
    );

    return NextResponse.json(resp.map(({ data }) => data));

   /*  const res = await redisClient.brPop("testl", 100);

    return NextResponse.json({ res }); */
}
