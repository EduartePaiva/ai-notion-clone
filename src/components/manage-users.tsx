"use client";

import { useState, useTransition } from "react";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
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
import { db } from "@/firebase";
import useOwner from "@/lib/use-owner";

import { Button } from "./ui/button";

export default function ManageUsers() {
    const { user } = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const [open, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [usersInRoom] = useCollection(
        user &&
            query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
    );

    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if (!user) return;

            const { success } = await removeUserFromDocumentAction({
                roomId: room.id,
                userId,
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
                <DialogTrigger>
                    Users ({usersInRoom?.docs.length})
                </DialogTrigger>
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
                    {usersInRoom?.docs.map((doc) => (
                        <div
                            key={doc.data().userId}
                            className="flex items-center justify-between"
                        >
                            <p className="font-light">
                                {doc.data().userId ===
                                user?.emailAddresses[0].toString()
                                    ? `You (${doc.data().userId})`
                                    : doc.data().userId}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant={"outline"}>
                                    {doc.data().role}
                                </Button>
                                {isOwner &&
                                    doc.data().userId !==
                                        user?.emailAddresses[0].toString() && (
                                        <Button
                                            variant={"destructive"}
                                            onClick={() =>
                                                handleDelete(doc.data().userId)
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
