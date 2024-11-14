"use client";

import React from "react";

import Document from "@/components/document";

interface PageType {
    params: Promise<{
        id: string;
    }>;
}

export default function DocumentPage({ params }: PageType) {
    const { id } = React.use(params);
    return (
        <div className="flex min-h-screen flex-1 flex-col">
            <Document id={id} />
        </div>
    );
}
