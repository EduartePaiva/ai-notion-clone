"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { db } from "@/firebase";

type SidebarOptionsType = {
    href: string;
    id: string;
};

export default function SidebarOptions({ href, id }: SidebarOptionsType) {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const pathName = usePathname();
    const isActive = href.includes(pathName) && pathName !== "/";

    if (!data) return null;

    return (
        <Link
            href={href}
            className={`relative rounded-md border p-2 ${isActive ? "border-black bg-gray-300 font-bold" : "border-gray-400"}`}
        >
            <p className="truncate">{data.title}</p>
        </Link>
    );
}
