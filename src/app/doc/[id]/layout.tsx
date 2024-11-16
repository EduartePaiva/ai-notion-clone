import { ReactNode } from "react";

import { auth } from "@clerk/nextjs/server";

import RoomProvider from "@/components/providers/room-provider";

type DocLayoutType = {
    children: ReactNode;
    params: { id: string };
};

export default async function DocLayout({ children, params }: DocLayoutType) {
    await auth.protect();
    return <RoomProvider roomId={params.id}>{children}</RoomProvider>;
}
