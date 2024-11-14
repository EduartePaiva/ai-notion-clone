import { ReactNode } from "react";

import { auth } from "@clerk/nextjs/server";

type DocLayoutType = {
    children: ReactNode;
    params: Promise<{
        id: string;
    }>;
};

export default async function DocLayout({ children, params }: DocLayoutType) {
    await auth.protect();
    const { id } = await params;
    return <div></div>;
}
