"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createNewDocumentAction } from "@/actions/actions";

import { Button } from "./ui/button";

export default function NewDocumentButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreateNewDocument = () => {
        startTransition(async () => {
            // create a new document
            const docId = await createNewDocumentAction();
            if (docId.docId !== undefined) {
                const params = new URLSearchParams();
                params.set("title", "New Doc");
                router.push(`doc/${docId.docId}?${params.toString()}`);
            }
            // TODO: handle error state
        });
    };

    return (
        <Button disabled={isPending} onClick={handleCreateNewDocument}>
            {isPending ? "creating..." : "New Document"}
        </Button>
    );
}
