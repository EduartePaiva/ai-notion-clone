"use client";

import React from "react";

interface PageType {
    params: Promise<{
        id: string;
    }>;
}

export default function Page({ params }: PageType) {
    const { id } = React.use(params);
    return <div>{id}</div>;
}
