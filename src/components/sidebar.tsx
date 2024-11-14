"use client";

import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import {
    type DocumentData,
    type Query,
    collectionGroup,
    query,
    where,
} from "firebase/firestore";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { db } from "@/firebase";

import NewDocumentButton from "./new-document-button";
import SidebarOptions from "./sidebar-options";

interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}

type GroupedData = {
    owner: (RoomDocument & { id: string })[];
    editor: (RoomDocument & { id: string })[];
};

export default function Sidebar() {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<GroupedData>({
        editor: [],
        owner: [],
    });

    const [data, loading, error] = useCollection<RoomDocument>(
        user &&
            query<RoomDocument, DocumentData>(
                collectionGroup(db, "rooms") as Query<
                    RoomDocument,
                    DocumentData
                >,
                where("userId", "==", user.emailAddresses[0].toString())
            )
    );

    useEffect(() => {
        if (!data) return;

        const grouped = data.docs.reduce<GroupedData>(
            (prev, current) => {
                const roomData = current.data();
                if (roomData.role == "owner") {
                    prev.owner.push({ id: current.id, ...roomData });
                }
                if (roomData.role == "editor") {
                    prev.owner.push({ id: current.id, ...roomData });
                }
                return prev;
            },
            { owner: [], editor: [] }
        );
        setGroupedData(grouped);
    }, [data]);

    const menuOptions = (
        <>
            <NewDocumentButton />
            {/* My Documents */}
            <div className="flex flex-col space-y-4 py-4 md:max-w-36">
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-sm font-semibold text-gray-500">
                        No Documents found
                    </h2>
                ) : (
                    <>
                        <h2 className="text-sm font-semibold text-gray-500">
                            My Documents
                        </h2>
                        {groupedData.owner.map((doc) => (
                            <SidebarOptions
                                key={doc.id}
                                id={doc.id}
                                href={`/doc/${doc.id}`}
                            />
                        ))}
                    </>
                )}
            </div>
            {/* Shared with me */}
            {groupedData.editor.length === 0 && (
                <>
                    <h2 className="text-sm font-semibold text-gray-500">
                        Shared with Me
                    </h2>
                    {groupedData.editor.map((doc) => (
                        <SidebarOptions
                            key={doc.id}
                            id={doc.id}
                            href={`/doc/${doc.id}`}
                        />
                    ))}
                </>
            )}
            {/* List... */}
        </>
    );
    return (
        <div className="relative bg-gray-200 p-2 md:p-5">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon
                            className="relative rounded-lg p-2 hover:opacity-30 md:p-5"
                            size={40}
                        />
                    </SheetTrigger>
                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>{menuOptions}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden md:inline">{menuOptions}</div>
        </div>
    );
}
