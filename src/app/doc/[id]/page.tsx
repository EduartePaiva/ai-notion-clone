"use client";

import { use } from "react";

import Document from "@/components/document";

interface PageType {
    params: Promise<{
        id: string;
    }>;
}

export default function DocumentPage(props: PageType) {
    const params = use(props.params);
    const { id } = params;
    return (
        <div className="flex min-h-screen flex-1 flex-col">
            <Document id={id} />
        </div>
    );
}
