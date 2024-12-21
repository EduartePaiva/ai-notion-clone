"use server";

import { auth } from "@clerk/nextjs/server";

import db from "@/db";
import { documents, users, usersToDocuments } from "@/db/schema";
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";

export async function createNewDocumentAction() {
    try {
        await auth.protect();
        const { sessionClaims } = await auth();
        if (sessionClaims === null) {
            throw new Error("Null session claims");
        }
        const documentId = await db.transaction(async (tx) => {
            // create a user if not exists, on conflict do nothing
            await tx
                .insert(users)
                .values({
                    id: sessionClaims.sub,
                    email: sessionClaims.email,
                })
                .onConflictDoNothing({ target: [users.id] });

            // create a doc and return it's id
            const [doc] = await tx
                .insert(documents)
                .values({ title: "New Doc" })
                .returning();

            // create the relation between the user and the doc
            await tx.insert(usersToDocuments).values({
                documentId: doc.id,
                userId: sessionClaims.sub,
                role: "owner",
            });
            return doc.id;
        });

        return { docId: documentId };
    } catch (e) {
        console.error(e);
        return { error: "Error while creating the document" };
    }
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

export async function removeUserFromDocumentAction({
    roomId,
    userId,
}: {
    roomId: string;
    userId: string;
}): Promise<{
    success: boolean;
}> {
    await auth.protect();
    console.log("removeUserFromDocument", roomId, userId);
    try {
        await adminDb
            .collection("users")
            .doc(userId)
            .collection("rooms")
            .doc(roomId)
            .delete();

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}
