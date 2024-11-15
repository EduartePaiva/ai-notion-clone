import { MousePointer } from "lucide-react";

type FollowPointerType = {
    info: Liveblocks["UserMeta"]["info"];
    x: number;
    y: number;
};

export default function FollowPointer({ x, y }: FollowPointerType) {
    return (
        <div
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <MousePointer />
        </div>
    );
}
