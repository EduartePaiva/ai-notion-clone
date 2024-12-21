import { useEffect, useState, useTransition } from "react";

import { useUser } from "@clerk/nextjs";

import { fetchDocumentsFromUser } from "@/actions/actions";
import { SplitUsersToDocument } from "@/db/schema/users-to-documents";

interface GroupedData {
    editor: SplitUsersToDocument<"editor">[];
    owner: SplitUsersToDocument<"owner">[];
}

export default function useUsersToDocumentsData() {
    const [groupedData, setGroupedData] = useState<GroupedData>({
        editor: [],
        owner: [],
    });
    const [fetching, startTransition] = useTransition();
    const { isSignedIn } = useUser();

    useEffect(() => {
        startTransition(async () => {
            const docsData = await fetchDocumentsFromUser();
            if (docsData.error !== undefined || !isSignedIn) {
                setGroupedData({
                    editor: [],
                    owner: [],
                });
                return;
            }

            const data: GroupedData = {
                editor: [],
                owner: [],
            };

            docsData.docs.forEach((doc) => {
                if (doc.role === "editor") {
                    data.editor.push({
                        documentId: doc.documentId,
                        createdAt: doc.createdAt,
                        role: doc.role,
                        documentTitle: doc.documentTitle ?? "",
                    });
                } else {
                    data.owner.push({
                        documentId: doc.documentId,
                        createdAt: doc.createdAt,
                        role: doc.role,
                        documentTitle: doc.documentTitle ?? "",
                    });
                }
            });

            setGroupedData(data);
        });
    }, [isSignedIn]);

    return { groupedData, fetching };
}
