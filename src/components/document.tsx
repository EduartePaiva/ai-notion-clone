"use client";

import { FormEvent, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import useOwner from "@/lib/use-owner";

import Avatars from "./avatars";
import DeleteDocument from "./delete-document";
import Editor from "./editor";
import InviteUser from "./invite-user";
import ManageUsers from "./manage-users";
import { Button } from "./ui/button";

type DocumentProps = {
    title: string;
};

export default function Document({ title }: DocumentProps) {
    const [input, setInput] = useState(title);
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    const updateTitle = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.trim()) {
            startTransition(async () => {
                // await updateDoc(doc(db, "documents", id), {
                //     title: input.trim(),
                // });
            });
        }
    };
    return (
        <div className="h-full flex-1 bg-white p-5">
            <div className="mx-auto flex max-w-6xl justify-between pb-5">
                <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
                    {/* update title... */}
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                    />

                    <Button disabled={isUpdating} type="submit">
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>

                    {/* If */}
                    {isOwner && (
                        <>
                            {/* Invite User */}
                            <InviteUser />
                            {/* Delete document */}
                            <DeleteDocument />
                        </>
                    )}
                </form>
            </div>

            <div className="max-w6xl mx-auto mb-5 flex items-center justify-between">
                {/* ManageUsers */}
                <ManageUsers />
                <Avatars />
            </div>
            <hr className="pb-10" />
            <Editor />
            {/* Collaborative Editor */}
        </div>
    );
}
