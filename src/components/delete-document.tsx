"use client";

import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";

export default function DeleteDocument() {
    const [open, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleDelete = async () => {};
    return (
        <AlertDialog open={open} onOpenChange={setIsOpen}>
            <Button asChild variant={"destructive"}>
                <AlertDialogTrigger>Delete</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to Delete?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the document and all it&apos;s content,
                        removing all users from the document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        type="button"
                        variant={"destructive"}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                        onClick={() => setIsOpen(false)}
                        variant={"secondary"}
                    >
                        Close
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
