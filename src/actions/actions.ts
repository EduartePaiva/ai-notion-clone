"use server";

import { auth } from "@clerk/nextjs/server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";

export async function createNewDocumentAction() {
    await auth.protect();

    const { sessionClaims } = await auth();
    if (sessionClaims === null) {
        return;
    }

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
    });
    await adminDb
        .collection("users")
        .doc(sessionClaims.email)
        .collection("rooms")
        .doc(docRef.id)
        .set({
            userId: sessionClaims.email,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id,
        });

    return { docId: docRef.id };
}

export async function deleteDocumentAction(roomId: string): Promise<{
    success: boolean;
}> {
    await auth.protect();
    console.log(`deleteDocument: ${roomId}`);

    try {
        // delete the document reference itself
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();
        const batch = adminDb.batch();
        // delete the room reference in the user's collection for every user in the room
        query.forEach((doc) => batch.delete(doc.ref));

        await batch.commit();

        await liveblocks.deleteRoom(roomId);

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}

export async function inviteUserToDocumentAction({
    roomId,
    userEmail,
}: {
    roomId: string;
    userEmail: string;
}): Promise<{
    success: boolean;
}> {
    await auth.protect();
    console.log(`inviteUser: ${userEmail}`);

    try {
        await adminDb
            .collection("users")
            .doc(userEmail)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: userEmail,
                role: "editor",
                createdAt: new Date(),
                roomId,
            });

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}
