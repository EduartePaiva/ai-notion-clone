import { useEffect, useState, useTransition } from "react";

import { useUser } from "@clerk/nextjs";

import { fetchUsersFromDocument } from "@/actions/actions";
import { UsersToDocument } from "@/db/schema/users-to-documents";

export default function useUsersInDocument(documentId: string) {
    const [usersInDoc, setUsersInDoc] = useState<
        { userId: string; role: UsersToDocument["role"] }[]
    >([]);
    const [fetching, startTransition] = useTransition();
    const { isSignedIn } = useUser();

    useEffect(() => {
        startTransition(async () => {
            const data = await fetchUsersFromDocument(documentId);
            if (data.error !== undefined || !isSignedIn) {
                return;
            }

            setUsersInDoc(data.docs);
        });
    }, [isSignedIn, documentId]);

    return { usersInDoc, fetching };
}
