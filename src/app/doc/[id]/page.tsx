"use client";

import Document from "@/components/document";

interface PageType {
    params: {
        id: string;
    };
}

export default function DocumentPage({ params }: PageType) {
    const { id } = params;
    return (
        <div className="flex min-h-screen flex-1 flex-col">
            <Document id={id} />
        </div>
    );
}
