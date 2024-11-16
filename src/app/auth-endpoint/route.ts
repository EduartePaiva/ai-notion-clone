import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";

export async function POST(req: NextRequest) {
    await auth.protect(); // ensures the user is authenticated
    const { sessionClaims } = await auth();
    if (sessionClaims === null) {
        return new Response("unauthorized", {
            status: 401,
        });
    }
    // get roomId from liveBlocks
    const { room } = await req.json();

    const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
            name: sessionClaims.fullName,
            email: sessionClaims.email,
            avatar: sessionClaims.image,
        },
    });

    const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims.email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();
        console.log("you are authorized");
        return new Response(body, { status });
    }

    return NextResponse.json(
        { message: "You are not in this room" },
        { status: 403 }
    );
}
