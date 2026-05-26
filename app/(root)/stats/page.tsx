import { auth } from "@/auth";
import Container from "@/components/Container";
import UserStatsDashboard from "@/components/stats/UserStatsDashboard";
import { getUserStats } from "@/lib/getUserStats";
import prisma from "@/prisma/prisma-client";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default async function StatsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findFirst({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        await signOut();

        redirect("/signin");
    }

    const stats = await getUserStats(user.id);

    return (
        <Container>
            <UserStatsDashboard data={stats} />
        </Container>
    );
}
