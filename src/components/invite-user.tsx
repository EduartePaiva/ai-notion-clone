"use client";

import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import { toast } from "sonner";

import { inviteUserToDocumentAction } from "@/actions/actions";
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
import { Input } from "./ui/input";

export default function InviteUser() {
    const [open, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const [email, setEmail] = useState("");

    const handleInvite = async () => {
        const roomId = pathname.split("/").pop();
        if (!roomId) return;

        startTransition(async () => {
            const { success } = await inviteUserToDocumentAction({
                roomId,
                userEmail: email,
            });
            if (success) {
                setIsOpen(false);
                setEmail("");
                toast.success("User Added to Room successfully!");
            } else {
                toast.error("Failed to add user to room!");
            }
        });
    };
    return (
        <AlertDialog open={open} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <AlertDialogTrigger>Invite</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Invite a User to collaborate!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter the email of the user you want to invite.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AlertDialogFooter>
                    <Button
                        type="button"
                        variant={"default"}
                        disabled={isPending || !email}
                        onClick={handleInvite}
                    >
                        {isPending ? "Inviting..." : "Invite"}
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
