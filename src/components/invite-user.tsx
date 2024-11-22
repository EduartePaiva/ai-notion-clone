"use client";

import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import { toast } from "sonner";

import { inviteUserToDocumentAction } from "@/actions/actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
        <Dialog open={open} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>Invite</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to collaborate!</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <DialogFooter>
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
