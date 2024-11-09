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
            router.push(`docs/${docId?.docId}`);
        });
    };

    return (
        <Button disabled={isPending} onClick={handleCreateNewDocument}>
            {isPending ? "creating..." : "New Document"}
        </Button>
    );
}
