"use client";

import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SplitUsersToDocument } from "@/db/schema/users-to-documents";

import NewDocumentButton from "./new-document-button";
import SidebarOptions from "./sidebar-options";

interface GroupedData {
    editor: SplitUsersToDocument<"editor">[];
    owner: SplitUsersToDocument<"owner">[];
}

export default function Sidebar() {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<GroupedData>({
        editor: [],
        owner: [],
    });

    const [data] = useCollection<RoomDocument>(
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
        console.log(data);

        const grouped = data.docs.reduce<GroupedData>(
            (prev, current) => {
                const roomData = current.data();
                if (roomData.role == "owner") {
                    prev.owner.push({ id: current.id, ...roomData });
                }
                if (roomData.role == "editor") {
                    prev.editor.push({ id: current.id, ...roomData });
                }
                return prev;
            },
            { owner: [], editor: [] }
        );
        console.log(grouped);
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
                {/* Shared with me */}
                {groupedData.editor.length !== 0 && (
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
            </div>
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
