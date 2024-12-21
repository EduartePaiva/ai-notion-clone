"use client";

import { useState, useTransition } from "react";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { toast } from "sonner";

import { removeUserFromDocumentAction } from "@/actions/actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useUsersInDocument from "@/hooks/use-users-in-document";
import useOwner from "@/lib/use-owner";

import { Button } from "./ui/button";

export default function ManageUsers() {
    const { user } = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const [open, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { usersInDoc } = useUsersInDocument(room.id);

    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if (!user) return;

            const { success } = await removeUserFromDocumentAction({
                roomId: room.id,
                userId: userId,
            });

            if (success) {
                toast.success("User removed from room successfully!");
            } else {
                toast.error("Failed to remove user from room!");
            }
        });
    };
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>Users ({usersInDoc.length})</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Users with Access</DialogTitle>
                    <DialogDescription>
                        Below is a list of users who have access to this
                        document.
                    </DialogDescription>
                </DialogHeader>

                <hr className="my-2" />
                <div className="flex flex-col gap-2">
                    {usersInDoc.map((doc) => (
                        <div
                            key={doc.userId}
                            className="flex items-center justify-between"
                        >
                            <p className="font-light">
                                {doc.userId ===
                                user?.emailAddresses[0].toString()
                                    ? `You (${doc.userId})`
                                    : doc.userId}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant={"outline"}>{doc.role}</Button>
                                {isOwner &&
                                    doc.userId !==
                                        user?.emailAddresses[0].toString() && (
                                        <Button
                                            variant={"destructive"}
                                            onClick={() =>
                                                handleDelete(doc.userId)
                                            }
                                            disabled={isPending}
                                            size={"sm"}
                                        >
                                            {isPending ? "Removing" : "X"}
                                        </Button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
