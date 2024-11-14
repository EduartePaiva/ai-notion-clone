"use client";

import { PointerEvent, ReactNode } from "react";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";

type LiveCursorProviderType = {
    children: ReactNode;
};
export default function LiveCursorProvider({
    children,
}: LiveCursorProviderType) {
    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();
    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {};
    return <div onPointerMove={handlePointerMove}>{/* Render cursors */}</div>;
}
