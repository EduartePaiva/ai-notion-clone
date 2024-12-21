"use client";

import { MenuIcon } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import useUsersToDocumentsData from "@/hooks/use-users-to-documents-data";

import NewDocumentButton from "./new-document-button";
import SidebarOptions from "./sidebar-options";

export default function Sidebar() {
    const { groupedData } = useUsersToDocumentsData();
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
                                key={doc.documentId}
                                id={doc.documentId}
                                href={`/doc/${doc.documentId}`}
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
                                key={doc.documentId}
                                id={doc.documentId}
                                href={`/doc/${doc.documentId}`}
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
